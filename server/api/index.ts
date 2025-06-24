// import categories from "./categories.json";
require("dotenv").config();

/* OpenAI */
const uri = process.env.OPENAI_APP_BASE_URI;
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_APP_MODEL;

/* Foursquare */
const fsuri = process.env.FS_URI;
const fsapikey = process.env.FS_API_KEY;

type openAIProps = {
  query: string;
  uri: string;
  apiKey: string;
  model: string;
};

export const getQueryInJSON = async ({ query, uri, apiKey, model }: openAIProps): Promise<string> => {
  // console.log(uri);

  const openaiResponse = await fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "user",
          content: `Convert the following text into a structured JSON command using an LLM. The command should be in the format of a JSON object with the following keys: "search_for", and parameters object with keys of "food" as array, "near", "rating", "price_level", "operating_hours", "open_now" as boolean, "latitude", "longitude", "radius(in meters)", "min_price", "max_price". If the text does not looking for a restaurant, set search_for to "Place". If the query is null, set search_for to "Place". If the city or address is present, fill up the correct latitude and longitude in reference to the city or address. The values for these keys should be extracted from the text. If any of the keys are not present in the text, they should be set to null. The JSON object should be formatted as a single line string without any line breaks or extra spaces. The command should be valid JSON and should not contain any additional text or explanations.  Here is the text: ${query}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });
  const openaiData = await openaiResponse.json();

  return openaiData.choices[0].message.content;
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
