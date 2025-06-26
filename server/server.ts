/* dependencies */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/* routes */
import restaurantRouter from "./routes/restaurant.route";

/* server setup */
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/api", restaurantRouter)

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
