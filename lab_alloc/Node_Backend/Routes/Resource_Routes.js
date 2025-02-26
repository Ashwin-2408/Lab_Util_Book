import express from "express";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";

const Resource_Router = express.Router();

Resource_Router.get("/available", getAvailableResources);

export default Resource_Router;
