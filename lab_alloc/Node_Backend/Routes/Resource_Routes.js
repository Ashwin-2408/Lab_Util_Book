import express from "express";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";
import {
  getUserRequests,
  requestResource,
} from "../Controllers/Resource_Request_Controller.js";
import {
  addResource,
  getPendingRequests,
} from "../Controllers/AdminController.js";


import { releaseResource } from "../Controllers/Release_Resources.js";
import { Router } from "express";
import { createBulkRequests } from "../Controllers/Resource_Request_Controller.js";

const Resource_Router = express.Router();
const router = Router();

Resource_Router.post("/available", getAvailableResources);
Resource_Router.post("/request", requestResource);
Resource_Router.patch("/:requestId/release", releaseResource);
Resource_Router.post("/requests/user", getUserRequests);

Resource_Router.get("/requests", getPendingRequests); 
 
;
Resource_Router.post("/add_resource", addResource);

// Bulk resource request route
router.post("/request/bulk", createBulkRequests);

export default Resource_Router;
