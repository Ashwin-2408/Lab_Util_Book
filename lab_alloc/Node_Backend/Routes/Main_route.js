import { Router } from "express";
import express from "express";
import Resource_Router from "./Resource_Routes.js";

const router = express.Router();
router.use("/resource", Resource_Router);

export default  router ;
