dotenv.config();
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import coneectDB from "./db/db.js";
import authRoute from "./routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.get("/", (req, res) => {
  res.send("Backend is working baby");
});

coneectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is Running in port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Oh shit there we go again ", err);
  });

export default app;
