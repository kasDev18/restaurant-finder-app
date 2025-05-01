const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { getQueryInJSON, findQueryAPI } = require("./api");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.post("/api/execute", async (req, res) => {
  const { query } = req.body;

  /* Convert query to JSON */
  const jsonResponse = await getQueryInJSON(query);
  const parsedResponse = JSON.parse(jsonResponse);
  const { search_for, parameters } = parsedResponse;
  
  /* Prevent non-restaurant queries condition */
  if (search_for !== "restaurant") {
    res.status(200).json({
      data: "Only restaurants are supported",
    });
  } else {
    const findQuery = await findQueryAPI(parameters);

    res.status(200).json({
      data: jsonResponse,
    });
  }
  // console.log(findQuery);

  // res.status(200).json({
  //   command: findQuery,
  // });

  // res.status(200).json({
  //     command: openaiData.choices[0].message.content,
  //   });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
