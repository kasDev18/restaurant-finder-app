import express from "express";
import { getQueryInJSON } from "../api";
import { QueryParamsProps, QueryProp, QueryErrorProps } from "../types/query";

export const getRestaurants = async (
  req: express.Request<QueryProp>,
  res: express.Response<QueryParamsProps | QueryErrorProps>,
): Promise<void> => {
  try {
    const { query } = req.body;

    // console.log("Received query:", query);

    const parsedResponse = await getQueryInJSON(
      query
    ); /* Convert query to JSON object (should return an object, not a string) */

    const { search_for, parameters } = JSON.parse(
      parsedResponse
    ) as QueryParamsProps; /* Destructure the search_for and parameters from the parsed JSON object */
    const { error_type } = JSON.parse(parsedResponse) as QueryErrorProps; /* Destructure error and error_type from the parsed JSON object */

    // console.log(error_type);
    
    if (error_type === "INVALID_SEARCH_TYPE") {
      res.status(406).json(JSON.parse(parsedResponse)); /* 406 Not Acceptable */
      return;
    } else if(error_type === "API_ERROR") {
      res.status(500).json(JSON.parse(parsedResponse)); /* 500 Internal Server Error */
      return;
    }

    console.log("Parsed response:", JSON.parse(parsedResponse));

    res.status(200).json(JSON.parse(parsedResponse));
    // return JSON.parse(parsedResponse);
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "An error occurred while processing your request.",
      details: error instanceof Error ? error.message : "Unknown error",
    } as QueryErrorProps); /* 500 Internal Server Error */
  }
};
