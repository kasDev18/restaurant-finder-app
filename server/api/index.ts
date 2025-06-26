import { openAIProps, FSAPIProps } from "../types/api";

require("dotenv").config();

/* Environment variables */
const { OPENAI_APP_BASE_URI, OPENAI_API_KEY, OPENAI_APP_MODEL } =
  process.env as openAIProps;
const { FS_URI, FS_API_KEY } = process.env as FSAPIProps;

export const getQueryInJSON = async (query: string): Promise<string> => {
  try {
    const openaiResponse = await fetch(OPENAI_APP_BASE_URI, {
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
            content: `Convert the following text into a structured JSON command using an LLM. The command should be in the format of a JSON object with the following keys: "search_for", and parameters object with keys of "food" as array, "near", "rating", "price_level", "operating_hours", "open_now" as boolean, "latitude", "longitude", "radius(in meters)", "min_price", "max_price". The "search_for" key should be set to "restaurant" If the city or address is present, fill up the correct latitude and longitude in reference to the city or address. The values for these keys should be extracted from the text. If any of the keys are not present in the text, they should be set to null. The JSON object should be formatted as a single line string without any line breaks or extra spaces. The command should be valid JSON and should not contain any additional text or explanations. If the query does not looking for a restaurant, return an error JSON object with the following keys: error: true, error_type: "INVALID_SEARCH_TYPE", message: "The only allowed search type is a restaurant". Here is the text: ${query}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });
    const openaiData = await openaiResponse.json();

    return openaiData.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching query in JSON:", error);
    return JSON.stringify({
      error: true,
      error_type: "API_ERROR",
      message: "Failed to fetch data from the API. Contact support.",
    });
  }
};

// export const findQueryAPI = async (params) => {
//   let queryArr = [];
//   const cuisines = params.query;
//   cuisines.forEach((cuisine) => {
//     const query =
//       cuisine.substring(0, 1).toUpperCase() +
//       cuisine.substring(1); /* Convert to title case */
//     queryArr.push(query);
//   });

//   let array = [];
//   // console.log(params.near);

//   // if (params.open_now) {
//     for (let i = 0; i < queryArr.length; i++) {
//       const response = await fetch(
//         `${fsuri}/search?near=${params.near}&query=${queryArr[i]}&open_now=${params.open_now}&limit=50`,
//         {
//           method: "GET",
//           headers: {
//             accept: "application/json",
//             Authorization: fsapikey,
//           },
//         }
//       );
//       const data = await response.json();

//       array.push(...data.results);
//     }
//     // console.log(array);

//     // return array;

//       /* Create a map to count the number of times a place with the same fsq_id appears */
//       const placeMap = new Map();
//       array.forEach((place) => {
//         const id = place.fsq_id;
//         if (!placeMap.has(id)) {
//           placeMap.set(id, { place, count: 1 })
//         } else {
//           placeMap.get(id).count++;
//         }
//       });

//       // console.log(placeMap);

//       // Filter places that appear for more than one cuisine
//       const multiCuisinePlaces = Array.from(placeMap.values())
//         .filter((entry) => entry.count == 1)
//         .map((entry) => entry.place);

//       return multiCuisinePlaces;
//   // }
// };

// export const fetchRestaurants = async () => {};

// // return data;

// // module.exports = {
// //   getQueryInJSON,
// //   findQueryAPI,
// //   fetchRestaurants,
// // };
