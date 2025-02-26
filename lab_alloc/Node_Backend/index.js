import "dotenv/config";

import express from "express";
import cors from "cors";
import router from "./Routes/Main_route.js";
import sequelize from "./Schema/db_connection.js";
import Allocation from "./Schema/Allocation.js";
import User from "./Schema/User.js";
import Resource from "./Schema/Resource.js";
import Lab from "./Schema/Lab.js";
import ResourceRequest from "./Schema/ResourceRequest.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("All tables have been initialized successfully.");
  })
  .catch((err) => {
    console.error("Error initializing tables:", err);
  });

app.listen(3001, (err) => {
  if (err) {
    console.log({ Err: "Server Failed" });
  }
  console.log("Server is listening on port 3001");
});
