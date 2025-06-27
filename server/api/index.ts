import { OpenAIProps, OpenAIResponseProps, FSAPIProps, FoursquarePhoto, FoursquarePlace } from "../types/api";
import { QueryErrorProps, QueryProp, QueryParamsProps } from "../types/query";

require("dotenv").config();


/* Environment variables */
const { OPENAI_APP_BASE_URI, OPENAI_API_KEY, OPENAI_APP_MODEL } =
  process.env as OpenAIProps;
const { FS_URI, FS_API_KEY } = process.env as FSAPIProps;

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
    const openaiResponse: Response = await fetch(OPENAI_APP_BASE_URI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_APP_MODEL,
        messages: [
          {
            role: "user",
            content: `Convert the following text into a structured JSON command using an LLM. The command should be in the format of a JSON object with the following keys: \"search_for\", and parameters object with keys of \"food\" as array, \"near\", \"rating\", \"price_level\", \"operating_hours\", \"open_now\" as boolean, \"latitude\", \"longitude\", \"radius_meters\", \"min_price\", \"max_price\", \"limit\". The \"search_for\" key should be set to \"restaurant\" If the city or address is present, fill up the correct latitude and longitude in reference to the city or address. The values for these keys should be extracted from the text. If any of the keys are not present in the text, they should be set to null. The JSON object should be formatted as a single line string without any line breaks or extra spaces. The command should be valid JSON and should not contain any additional text or explanations. If the query does not looking for a restaurant, return an error JSON object with the following keys: error: true, error_type: \"INVALID_SEARCH_TYPE\", message: \"The only allowed search type is a restaurant\". Here is the text: ${query}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });
    const openaiData: OpenAIResponseProps = await openaiResponse.json();
    const parsedJson = JSON.parse(openaiData.choices[0].message.content);

    /* Check if the response contains an error */
    if (parsedJson.error) {
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
const buildFSApiUrl = (baseUrl: string, params: Record<string, any>) => {
  const url = new URL(`${baseUrl}/search`); /* URL object */
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value.toString());
    }
  });
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
): Promise<void> => {
  console.log("Finding restaurants using FourSquare API...");
  try {
    const { parameters } = params;

    /* Build query parameters */
    const queryParams: Record<string, any> = {
      near: parameters.near,
      query: parameters.cuisine?.join(",") || "",
      open_now: parameters.open_now,
      limit: 2,
      rating: parameters.rating,
      price_level: parameters.price_level,
      operating_hours: parameters.operating_hours,
      latitude: parameters.latitude,
      longitude: parameters.longitude,
      radius: parameters.radius_meters,
      min_price: parameters.min_price,
      max_price: parameters.max_price,
      categories: "4d4b7105d754a06374d81259",
    };

    const url = buildFSApiUrl(FS_URI, queryParams);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: FS_API_KEY,
      },
    });

    const data = await res.json();

    console.log("Found restaurants:");
    console.log(data.results);
    return data.results;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return;
  }
};


/**
 * DOCU: This function is used to get the restaurant details from the FourSquare API based on the placeId. <br>
 * This is being called in the `findRestaurants` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @params {string} placeId
 * @returns {Promise<void>}
 * @author Kas
 */
export const findRestaurantDetails = async (
  placeId: string
): Promise<string> => {
  try {
    const response: Response = await fetch(
      `${FS_URI}/${placeId}?fields=fsq_id,name,location,categories,rating,price,hours`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: FS_API_KEY,
        },
      }
    );
    const data: FoursquarePlace = await response.json();

    console.log("Found restaurant details:");
    console.log(data);

    const photoUrl: FoursquarePhoto[] = await getRestaurantsPhoto(placeId);

    const priceLevelMap: Record<number, string> = {
      1: "Cheap",
      2: "Moderate",
      3: "Expensive",
      4: "Very Expensive",
    };

    const details = {
      name: data.name,
      address: data.location?.formatted_address || "",
      cuisine: data.categories?.map((cat: any) => cat.name).join(", ") || "",
      rating: data.rating ?? "N/A",
      price_level: (typeof data.price === "number" && priceLevelMap[data.price]) ? priceLevelMap[data.price] : "N/A",
      operating_hours: data.hours?.display || "N/A",
    };

    const obj: any = {};
    Object.entries(details).forEach(([key, value]) => {
      obj[key] = value;
      obj.photo = `${photoUrl[0].prefix}300x300${photoUrl[0].suffix}`;
    });
    const detailsJson = JSON.stringify(obj);

    return JSON.parse(detailsJson);
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
    const photosRes = await fetch(`${FS_URI}/${placeId}/photos`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: FS_API_KEY,
      },
    });
    const photo = await photosRes.json();
    return photo;
  } catch (error) {
    console.error("Error fetching restaurant photo:", error);
    throw error;
  }
};
