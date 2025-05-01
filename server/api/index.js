const categories = require("../categories.json");
require("dotenv").config();

const uri = process.env.OPENAI_APP_BASE_URI;
const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_APP_MODEL;

const fsuri = process.env.FS_URI;
const fsapikey = process.env.FS_API_KEY;

const getQueryInJSON = async (query) => {
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
          content: `Convert the following text into a structured JSON command using an LLM. The command should be in the format of a JSON object with the following keys: "search_for", and parameters object with keys of "query", "address", "city", "rating", "price_level", "operating_hours", "is_open_now", "latitude", "longitude". If the city or address is present, fill up the correct latitude and longitude in reference to the city or address. The values for these keys should be extracted from the text. If any of the keys are not present in the text, they should be set to null. The JSON object should be formatted as a single line string without any line breaks or extra spaces. The command should be valid JSON and should not contain any additional text or explanations. Here is the text: ${query}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  const openaiData = await openaiResponse.json();

  return openaiData.choices[0].message.content;
};

const findQueryAPI = async (params) => {
  const arr = [];
  const cuisines = params.query.split(" ");
  cuisines.forEach((cuisine) => {
    const query = cuisine.substring(0, 1).toUpperCase() + cuisine.substring(1);
    arr.push(query);
  });
  const allQuery = arr.reduce((a, b) => a + " " + b);

  const arrCategory = [];
  categories.find((category) => {
    // console.log(allQuery);

    if (category.category_label.includes(allQuery)) {
      arrCategory.push(category);
    }
  });

  console.log(arrCategory);

  //   const response = await fetch(`${fsuri}/search?near=${params.city}&query=${params.cuisine}`, {
  const response = await fetch(`${fsuri}/search`, {
    method: "GET",
    headers: {
      //   accept: "application/json",
      Authorization: fsapikey,
    },
  });
  //   const data = await response.json();
  //   return data;
};

// return data;

module.exports = {
  getQueryInJSON,
  findQueryAPI,
};
