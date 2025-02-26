import express from "express";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";
import { requestResource } from "../Controllers/Resource_Request_Controller.js";

const Resource_Router = express.Router();

Resource_Router.get("/available", getAvailableResources);
Resource_Router.post("/request", requestResource);

export default Resource_Router;
