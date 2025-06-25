import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { getQueryInJSON } from "./api";
import { QueryParamsProps } from "./types/query";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.post(
  "/api/execute",
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { query } = req.body;

      const parsedResponse = await getQueryInJSON(
        query
      ); /* Convert query to JSON object (should return an object, not a string) */
      const { search_for, parameters } = JSON.parse(
        parsedResponse
      ) as QueryParamsProps; /* Destructure the search_for and parameters from the parsed JSON object */

      res.status(200).json(JSON.parse(parsedResponse));
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "An error occurred while processing your request.",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
