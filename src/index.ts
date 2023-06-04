import express, { Response, Request } from "express";
import cors from "cors";
import logger from "morgan";
import mongoose from "mongoose";
import userRoutes from "./routes/User";
import riderRoutes from "./routes/Riders";
import passengerRoutes from "./routes/Passenger";

import dotenv from 'dotenv';
const cookieParser = require("cookie-parser");

dotenv.config()

const app = express()


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger("dev"));

app.use("/api/users", userRoutes);
app.use("/api/riders", riderRoutes);
app.use("/api/passengers", passengerRoutes);




(async () => {
  try {
    mongoose.connect(process.env.MONGO_URI!, () => {
      console.log("Database connected successfully");
    });
  } catch (error) {
    console.log(error);
  }
})();

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "api is running",
  });
});

const PORT = process.env.PORT || 4245;

app.listen(PORT, () => {
  console.log(`server is listening on http://localhost:${PORT}`);
});

export default app;