import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import tourRouter from "./routes/tourRoute.js";

const app = express();

// Load env variables
dotenv.config();
// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Routes
app.use("/api/v1/users", userRouter); // http://localhost:5000/api/v1/users/signup
app.use("/api/v1/tours", tourRouter); // http://localhost:5000/api/v1/tour

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
