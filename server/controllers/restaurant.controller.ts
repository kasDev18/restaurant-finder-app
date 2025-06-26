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
): Promise<any> => {
  try {
    const { query } = req.body;
    console.log("Receiving query...");
    console.log(query);

    /* Convert query to JSON object (should return an object, not a string) */
    const parsedResponse = await getQueryInJSON(query.message);
    const parsedJson = JSON.parse(parsedResponse);

    /* Destructure error and error_type from the parsed JSON object */
    const { error_type } = parsedJson as QueryErrorProps;

    /* Handle different error types */
    if (error_type === "INVALID_SEARCH_TYPE") {
      res.status(406).json(parsedJson); /* 406 Not Acceptable */
      return parsedJson;
    } else if (error_type === "API_ERROR") {
      res.status(500).json(parsedJson); /* 500 Internal Server Error */
      return parsedJson;
    }
    console.log(parsedJson);

    // res.status(200).json(parsedJson);
    return parsedJson;
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
