import express from "express";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";
import { requestResource } from "../Controllers/Resource_Request_Controller.js";
import { getPendingRequests } from "../Controllers/AdminController.js";
import { approveRequest } from "../Controllers/AdminController.js";
import { rejectRequest } from "../Controllers/AdminController.js";

const Resource_Router = express.Router();

Resource_Router.get("/available", getAvailableResources);
Resource_Router.post("/request", requestResource);

Resource_Router.get("/requests", getPendingRequests); // 📌 View all pending requests
Resource_Router.patch("/:requestId/approve", approveRequest); // ✅ Approve request
Resource_Router.patch("/:requestId/reject", rejectRequest);

export default Resource_Router;
