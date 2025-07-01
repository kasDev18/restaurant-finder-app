import { FilterPlaceParamsProps, QueryResponseProps } from "../../types/query";
import { getFSOptions } from "./options";
import { envConfig } from "../../config/env";
import { getStarRating } from "./rating";

const env: NodeJS.ProcessEnv = envConfig();

/**
 * DOCU: This function is used to filter the restaurants based on the parameters. <br>
 * This is being called in the `getRestaurants` <br>
 * Last Updated Date: July 1, 2025 <br>
 * @function
 * @params {QueryResponseProps[]} filtered
 * @params {FilterPlaceParamsProps} parameters
 * @params {boolean} open_now
 * @returns {Promise<QueryResponseProps[]>}
 * @author Kas
 */
export const filterRestaurants = async (
  filtered: QueryResponseProps[],
  parameters: FilterPlaceParamsProps,
  open_now: boolean
): Promise<QueryResponseProps[]> => {
  let result = filtered;

  // Filter by cuisine (category)
  if (parameters.cuisine) {
    console.log("Filtering by cuisine...");
    const cuisineLower = parameters.cuisine.map((c) => c.toLowerCase());
    result = result.filter(
      (place) =>
        place.categories &&
        place.categories.some((cat: any) =>
          cuisineLower.some((c) => cat.name.toLowerCase().includes(c))
        )
    );
    console.log("Filtered by cuisine.");
  }

  // Filter by open now
  if (open_now) {
    console.log("Filtering by open now...");
    // Fetch all hours in parallel and filter only open places
    const openResults = await Promise.all(
      result.map(async (place) => {
        const openNow = await getPlaceHrsObj(place.fsq_id);
        // console.log("openNow", openNow);
        
        if (openNow && openNow.hours && openNow.hours.open_now) {
          place.open_now = openNow.hours.open_now;
          return place;
        }
        return null;
      })
    );
    result = openResults.filter(Boolean) as QueryResponseProps[];
    console.log("Filtered by open now.");
    // console.log(result);
    
  }

  if (parameters.price_level) {
    console.log("Filtering by price level...");

    // Fetch places by price level
    const priceResults = await Promise.all(
      result.map(async (place) => {
        const priceLevel = await getPlacePriceLevel(place.fsq_id);
        if (priceLevel && priceLevel.price === parameters.price_level) {
          place.price_level = priceLevel.price;
          return place;
        };
        return null;
      })
    );
    result = priceResults.filter(Boolean) as QueryResponseProps[];
    console.log("Filtered by price level.");
  }

  if (parameters.rating) {
    console.log("Filtering by rating...");

    // Fetch places by rating
    const ratingResults = await Promise.all(
      result.map(async (place) => {
        const rating = await getPlaceRating(place.fsq_id, parameters.rating);
        if (rating && rating.fsq_id === place.fsq_id) {
          
          const starRating = getStarRating(rating.rating);
          place.star_rating = starRating;
          place.rating = rating.rating;

          if (typeof place.rating === 'number' && typeof parameters.rating === 'number' && place.rating >= parameters.rating) {
            return place;
          }
        }
        return null;
      })
    );
    result = ratingResults.filter(Boolean) as QueryResponseProps[];
    console.log("Filtered by rating.");
  }

  console.log("Filtering complete!!!");
  // console.log(result);
  

  return result;
};

/* Fetch place details by field */
async function filterPlaceByField(
  fsq_id: string,
  field: string
): Promise<QueryResponseProps> {
  const fetchDetail = await fetch(
    `${env.FS_URI}/${fsq_id}?fields=${field}`,
    getFSOptions("GET", env.FS_API_KEY as string)
  );

  return fetchDetail.json();
}

/* Fetch place hours */
async function getPlaceHrsObj(fsq_id: string): Promise<any> {
  try {
    const placeHrsDetail = await filterPlaceByField(fsq_id, "hours");

    if (placeHrsDetail) {
      placeHrsDetail.fsq_id = fsq_id;
      return placeHrsDetail;
    }
  } catch (error) {
    console.error("Error fetching place hours:", error);
  }
}

/* Fetch place price level */
async function getPlacePriceLevel(fsq_id: string): Promise<any> {
  try {
    const placePriceLvl = await filterPlaceByField(fsq_id, "price");

    return placePriceLvl;
  } catch (error) {
    console.error("Error fetching place hours:", error);
  }
}

/* Fetch place rating */
async function getPlaceRating(fsq_id: string, rating?: number): Promise<any> {
  try {
    const placeRating = await filterPlaceByField(fsq_id, "rating");
    placeRating.fsq_id = fsq_id;
    return placeRating;
  } catch (error) {
    console.error("Error fetching place hours:", error);
  }
}
