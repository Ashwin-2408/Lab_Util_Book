const express = require("express");
const cors = require("cors");
const Router = require("./Routes/Main_route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(Router);
app.listen(3001, (err) => {
  if (err) {
    console.log({ Err: "Server Failed" });
  }
  console.log("Server is listening on port 3001");
});
