import Resource_Request from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";
import { Op } from "sequelize";

import ResourceRequest from "../Schema/ResourceRequest.js";
import Lab from "../Schema/Lab.js";

export const requestResource = async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

    const { resourceId, userId } = req.body;

    if (!resourceId || !userId) {
      console.log("Validation Error: Missing fields");
      return res
        .status(400)
        .json({ error: "resourceId and userId are required" });
    }

    // Check if resource is available
    const resource = await Resource.findOne({
      where: { resource_id: resourceId, status: "Available" },
    });

    if (!resource) {
      console.log("Resource not found or unavailable");
      return res.status(404).json({ error: "Resource not available" });
    }

    console.log("Resource found:", resource);

    // Create a new request
    const newRequest = await ResourceRequest.create({
      resource_id: resourceId,
      user_id: userId,
      status: "Pending",
    });

    console.log("New Request Created:", newRequest);

    res.status(201).json({
      message: "Resource request submitted successfully",
      requestId: newRequest.request_id,
      status: newRequest.status,
    });
  } catch (error) {
    console.error("Error requesting resource:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getUserRequests = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("Validation Error: Missing userId");
      return res.status(400).json({ error: "userId is required" });
    }

    // Fetch resource requests for the given userId
    const requests = await ResourceRequest.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Resource,
          attributes: ["resource_id", "status", "createdAt", "type"],
          include: [
            {
              model: Lab,
              attributes: ["lab_name"], // Include Lab Name
              as: "lab",
            },
          ],
        },
      ],
    });

    if (!requests.length) {
      console.log("No requests found for user");
      return res.status(404).json({ error: "No requests found for this user" });
    }

    console.log("Requests found:", requests);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching user requests:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};


// Bulk resource request handler
export const createBulkRequests = async (req, res) => {
  const { userId, resources } = req.body;

  if (!userId || !Array.isArray(resources) || resources.length === 0) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  const transaction = await Resource_Request.sequelize.transaction();

  try {
    // Check if all resources exist and are available
    const resourceIds = resources.map(r => r.resourceId);
    const availableResources = await Resource.findAll({
      where: {
        resource_id: { [Op.in]: resourceIds },
        status: 'available'
      },
      transaction
    });

    if (availableResources.length !== new Set(resourceIds).size) {
      await transaction.rollback();
      return res.status(400).json({ 
        error: "One or more resources are not available" 
      });
    }

    // Create requests for each resource
    const requests = await Promise.all(
      resources.map(async (resource) => {
        return Resource_Request.create({
          user_id: userId,
          resource_id: resource.resourceId,
          status: 'pending',
          request_date: new Date()
        }, { transaction });
      })
    );

    // Update resources status to 'pending'
    await Resource.update(
      { status: 'pending' },
      {
        where: { resource_id: { [Op.in]: resourceIds } },
        transaction
      }
    );

    await transaction.commit();

    // Format response
    const formattedRequests = requests.map(request => ({
      requestId: request.request_id,
      resourceId: request.resource_id,
      status: request.status
    }));

    res.status(201).json({
      success: true,
      batchId: Date.now(),
      requests: formattedRequests
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Bulk request error:', error);
    res.status(500).json({
      error: "Failed to process bulk resource request"
    });
  }
};
