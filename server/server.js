import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";

import cors from "cors";
import { userRouter } from "./routes/userRoute.js";

config();

const app = express();

app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
//app.use("/api/patients", patie);

// error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// Catch-all route for unknown queries
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

mongoose
  .connect(process.env.CONNECTION_URI, { dbName: "reshita-doctorapp" })
  .then(() => {
    console.log("MONGO JUMBO");
  })
  .catch((err) => console.log(err.message));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`serving at http://127.0.0.1:${port}`);
});
