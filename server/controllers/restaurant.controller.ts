import express from "express";
import {
  findRestaurantDetails,
  findRestaurantsFSAPI,
  getQueryInJSON,
} from "../api";
import { QueryParamsProps, QueryProp, QueryErrorProps, QueryResponseProps } from "../types/query";

/**
 * DOCU: This function is used to get the restaurants based on the query. <br>
 * This is being called in the `restaurantRouter.post('/execute', getRestaurants)` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @param {express.Request<QueryProp>} req - The request object.
 * @param {express.Response<QueryParamsProps | QueryErrorProps>} res - The response object.
 * @returns {Promise<void>}
 * @author Kas
 */
export const getRestaurants = async (
  req: express.Request<QueryProp>,
  res: express.Response<QueryParamsProps | QueryErrorProps>
): Promise<void> => {
  try {
    const { query } = req.body;
    console.log("Receiving query...");
    console.log(query);

    const response = await getQueryInJSON(query.message); /* Convert query to JSON object (should return an object, not a string) */

    const { error_type } =
      response as QueryErrorProps; /* Destructure error and error_type from the parsed JSON object */

    /* Check if there is an error */
    if (response.error) {
      if (error_type === "INVALID_SEARCH_TYPE") {
        res.status(406).json(response); /* 406 Not Acceptable */
      } else if (error_type === "API_ERROR") {
        res.status(500).json(response); /* 500 Internal Server Error */
      } else if (error_type === "NO_LOCATION") {
        res.status(400).json(response); /* 400 Bad Request */
      }else if(error_type === "INVALID_RATING"){
        res.status(406).json(response);
      }
      return;
    }

    /* Get restaurants from FourSquare API */
    const getRestaurants: any = await findRestaurantsFSAPI(
      response as QueryParamsProps
    );
    
    if(getRestaurants.error){
      res.status(406).json(getRestaurants);
      return;
    }

    if (getRestaurants.length === 0) {
      const errorObj = {
        error: true,
        error_type: "NO_RESTAURANTS_FOUND",
        message: "No restaurants found.",
        details: "No restaurants found",
      } as QueryErrorProps;
      res.status(404).json(errorObj); /* 404 Not Found */
      return;
    }

    /* Get details of the restaurants */
    let restaurantDetails: string[] = [];
    const details = await Promise.all(
      getRestaurants.map(async<T extends QueryResponseProps>(place: T) => {
        const details = await findRestaurantDetails(place);
        restaurantDetails.push(details);
      })
    );

    console.log("Restaurants sent successfully!");
    
    res.status(200).json(JSON.parse(JSON.stringify(restaurantDetails)));
  } catch (error) {
    /* Handle any unexpected errors */
    const errorObj = {
      error: true,
      message: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : "Unknown error",
    } as QueryErrorProps;

    res.status(500).json(errorObj); /* 500 Internal Server Error */
  }
};
