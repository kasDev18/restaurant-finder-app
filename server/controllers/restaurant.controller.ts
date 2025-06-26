import express from "express";
import { getQueryInJSON } from "../api";
import { QueryParamsProps, QueryProp, QueryErrorProps } from "../types/query";

/**
 * DOCU: This function is used to send the query to the OpenAI API and then get the response back as a JSON object <br>
 * This is being called in the `restaurantRouter.post('/execute', getRestaurants)` <br>
 * Last Updated Date: June 26, 2025 <br>
 * @function
 * @param {express.Request<QueryProp>} req - The request object containing the query in the body
 * @param {express.Response<QueryParamsProps | QueryErrorProps>} res - The response object
 * @returns {Promise<any>} - Returns a promise that resolves to the parsed JSON object or an error object
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

    /* Convert query to JSON object (should return an object, not a string) */
    const response = await getQueryInJSON(query.message);
    

    // /* Destructure error and error_type from the parsed JSON object */
    const { error_type } = response as QueryErrorProps;

    if (response.error) {
      if (error_type === "INVALID_SEARCH_TYPE") {
        res.status(406).json(response); /* 406 Not Acceptable */
      }else if (error_type === "API_ERROR") {   
        res.status(500).json(response); /* 500 Internal Server Error */
      }
    }

    /* If no error, send the parsed JSON object as a response */
    // const parsedResponse = JSON.parse(response)
    res.status(200).json(response); /* 200 OK */
    console.log("Response sent successfully!");
    // res.status(200).json(parsedResponse); /* 200 OK */
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

// export const findRestaurants = async (
//     req: express.Request<QueryProp>,
//     res: express.Response<QueryParamsProps | QueryErrorProps>
// ): Promise<void> => {
//     // Implement the logic to find restaurants based on the parsed JSON object
//     // This could involve querying a database or an external API
//     // For now, we will just return a mock response

//     const mockResponse = {
//         search_for: "restaurant",
//         parameters: {
//             food: ["pizza", "sushi"],
//             near: "New York",
//             rating: 4.5,
//             price_level: 2,
//             operating_hours: "10:00-22:00",
//             open_now: true,
//             latitude: 40.7128,
//             longitude: -74.0060,
//             radius: 5000,
//             min_price: 10,
//             max_price: 50
//         }
//     };

//     res.status(200).json(mockResponse);
// };
