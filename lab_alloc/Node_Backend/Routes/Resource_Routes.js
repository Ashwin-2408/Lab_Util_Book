import express from "express";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";
import {
  getUserRequests,
  requestResource,
} from "../Controllers/Resource_Request_Controller.js";
import { getPendingRequests } from "../Controllers/AdminController.js";
import { approveRequest } from "../Controllers/AdminController.js";
import { rejectRequest } from "../Controllers/AdminController.js";
import { releaseResource } from "../Controllers/Release_Resources.js";

const Resource_Router = express.Router();

Resource_Router.post("/available", getAvailableResources);
Resource_Router.post("/request", requestResource);
Resource_Router.patch("/:requestId/release", releaseResource);
Resource_Router.post("/requests/user", getUserRequests);

Resource_Router.get("/requests", getPendingRequests); 
Resource_Router.patch("/:requestId/approve", approveRequest); 
Resource_Router.patch("/:requestId/reject", rejectRequest);

export default Resource_Router;
