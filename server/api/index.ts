import {
  OpenAIResponseContent,
  FoursquarePhoto,
  FoursquarePlace,
} from "../types/api";
import {
  QueryErrorProps,
  QueryProp,
  QueryParamsProps,
  QueryResponseProps,
} from "../types/query";
import { queryParams } from "../utils/constants";
import { getOpenAIOptions, getFSOptions } from "../utils/helpers/options";
import { filterRestaurants } from "../utils/helpers/filter";
import { envConfig } from "../config/env";

require("dotenv").config();

/* Environment variables */
const env: NodeJS.ProcessEnv = envConfig();

/**
 * DOCU: This function is used to send the query to the OpenAI API and then get the response back as a JSON object <br>
 * This is being called in the `restaurantRouter.post('/execute', getRestaurants)` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @param {string} query
 * @returns {Promise<void>}
 * @author Kas
 */
export const getQueryInJSON = async (query: QueryProp): Promise<any> => {
  console.log("Parsing response...");
  try {
    const openaiResponse: Response = await fetch(
      env.OPENAI_APP_BASE_URI as string,
      getOpenAIOptions(query, env)
    );
    const openaiData: OpenAIResponseContent = await openaiResponse.json();
    const parsedJson = JSON.parse(openaiData.choices[0].message.content);

    /* Check if the response contains an error */
    if (parsedJson.error === true) {
      console.log("Parsing failed!!!");
      console.error("Error in response:", parsedJson.message);
      return parsedJson;
    }

    console.log("Parsing successful!!!");
    console.log(parsedJson);

    return parsedJson;
  } catch (error) {
    console.error("Error fetching query in JSON:", error);
    return {
      error: true,
      error_type: "API_ERROR",
      message: "Failed to fetch data from the API. Contact support.",
    } as QueryErrorProps;
  }
};

/**
 * DOCU: This function is used to build the URL for the FourSquare API <br>
 * This is being called in the `FindRestaurantsFSAPI` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @params {string} baseUrl
 * @params {Record<string, any>} params
 * @returns {Promise<void>}
 * @author Kas
 */
const buildFSApiUrl = (
  baseUrl: string,
  params: Record<string, string | number>
): string => {
  const url = new URL(`${baseUrl}/search`); /* URL object */
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value.toString());
    }
  });
  console.log("url", url.toString());

  return url.toString();
};

/**
 * DOCU: This function is used to get the restaurants from the FourSquare API based on the parameters. <br>
 * This is being called in the `getRestaurants` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @params {QueryParamsProps} params
 * @returns {Promise<void>}
 * @author Kas
 */
export const findRestaurantsFSAPI = async <T extends QueryParamsProps>(
  params: T
): Promise<FoursquarePlace[] | QueryResponseProps[] | void> => {
  console.log("Finding restaurants using FourSquare API...");
  try {
    const { parameters, open_now } = params;
    console.log("parameters", parameters);

    const queryParamsObject: Record<string, any> = queryParams(params);

    const url = buildFSApiUrl(env.FS_URI as string, queryParamsObject);
    const res = await fetch(url, getFSOptions("GET", env.FS_API_KEY as string));

    if (!res.ok) {
      console.error(`Foursquare API error: ${res.status} ${res.statusText}`);
      return;
    }

    const data: { results?: any[] } = await res.json();
    let resObj = Array.isArray(data.results) ? data.results : [];

    // Enrich each restaurant with star_rating and normalized price_level if available
    // resObj = resObj.map((place: any) => {
    //   // Map Foursquare rating (0-10) to star rating (1-5)
    //   const mapRatingToStars = (rating: number | undefined): number => {
    //     if (typeof rating !== "number") return 0;
    //     if (rating <= 2) return 1;
    //     if (rating <= 4) return 2;
    //     if (rating <= 6) return 3;
    //     if (rating <= 8) return 4;
    //     return 5;
    //   };
    //   return {
    //     ...place,
    //     star_rating: mapRatingToStars(place.rating),
    //     price_level: typeof place.price === "number" && priceLevelMap[place.price]
    //       ? priceLevelMap[place.price]
    //       : place.price,
    //   };
    // });

    // console.log("Enriched data:", resObj);
    const filtered = filterRestaurants(resObj, parameters, open_now);

    // console.log("Filtered restaurants:", filtered);
    return filtered;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return;
  }
};

/**
 * DOCU: This function is used to get the restaurant details from the FourSquare API based on the placeId and extract only the needed details. <br>
 * This is being called in the `findRestaurants` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @params {string} placeId
 * @returns {Promise<void>}
 * @author Kas
 */
export const findRestaurantDetails = async (
  place: QueryResponseProps
): Promise<any> => {
  try {
    const data = place;
    console.log("Extracting restaurant details...");

    const cuisineArray =
      data.categories?.map((cat: any) => [cat.name]) ||
      []; /* Get the cuisine array */

    /* Create an object with the details */
    const details = {
      name: data.name,
      address: data.location?.formatted_address || "",
      cuisine: cuisineArray,
      rating: data.rating ?? "N/A",
      star_rating: data.star_rating ?? "N/A",
      price: data.price_level ?? "N/A",
      open_now: data?.open_now ?? "N/A",
    };

    const photoUrl: FoursquarePhoto[] = await getRestaurantsPhoto(
      place.fsq_id
    ); /* Get the photo URL array */
    const obj: any = { ...details };
    obj.photo = photoUrl[0]
      ? `${photoUrl[0].prefix}300x300${photoUrl[0].suffix}`
      : null; /* Get the photo URL and add it to the object */

    console.log("Fetching Restaurant Details successful!!!. Sending to client...");
    return obj;
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    throw error;
  }
};

/**
 * DOCU: This function is used to restaurant photo from the FourSquare API based on the placeId. <br>
 * This is being called in the `findRestaurantDetails` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @params {string} placeId
 * @returns {Promise<void>}
 * @author Kas
 */
const getRestaurantsPhoto = async (placeId: string): Promise<any> => {
  try {
    const photosRes = await fetch(
      `${env.FS_URI}/${placeId}/photos`,
      getFSOptions("GET", env.FS_API_KEY as string)
    );
    const photo = await photosRes.json();
    return photo;
  } catch (error) {
    console.error("Error fetching restaurant photo:", error);
    throw error;
  }
};
