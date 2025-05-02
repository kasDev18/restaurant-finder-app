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

  // res.status(200).json({
  //   data: jsonResponse,
  // });

  /* Prevent non-restaurant queries condition */
  if (search_for.toLowerCase() !== "restaurant") {
    res.status(200).json({
      data: `${search_for} is not a valid search type`,
    });
  } else {
    const findQuery = await findQueryAPI(parameters);
    

    // res.status(200).json({
    //   data: jsonResponse,
    // });

    let array = [];

    if(findQuery.length){
      res.status(200).json({
        data: findQuery,
      });
    }else{
      res.status(200).json({
        data: "No results found",
      });
    }

    // if (findQuery.length > 1) {
    //   findQuery.reduce((a, b) => {
    //     let newObj = { ...a, ...b };
    //     array.push(newObj);
    //   });

    //   res.status(200).json({
    //     data: array,
    //   });
    // }else{
    //   res.status(200).json({
    //     data: findQuery,
    //   });
    // }

    // console.log(findQuery);

    // findQuery.forEach((query, index) => {
    //   array.push(findQuery[index])
    // })

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
