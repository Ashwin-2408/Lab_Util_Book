import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";
import BulkRequest from "../Schema/BulkRequest.js";
import ResourceAvailability from "../Schema/BulkResourceAvailability.js";
import Lab from "../Schema/Lab.js";

export const getPendingRequests = async (req, res) => {
  try {
    const bulkRequests = await BulkRequest.findAll({
      include: [
        { 
          model: ResourceAvailability,
          as: 'resourceAvailability',  // Add the association alias
          include: [
            { 
              model: Lab,
              as: 'lab'  // Add the association alias
            }
          ]
        }
      ]
    });

    // Transform the data to match frontend expectations
    const formattedRequests = bulkRequests.map(request => ({
      request_id: request.request_id,
      user_id: request.user_id,
      resource_type: request.resourceAvailability?.resource_type,
      lab_name: request.resourceAvailability?.lab?.name,
      requested_quantity: request.requested_quantity,
      status: request.status,
      createdAt: request.createdAt
    }));

    res.status(200).json({ requests: formattedRequests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ 
      error: "Failed to fetch requests",
      details: error.message 
    });
  }
};

export const approveBulkRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BulkRequest.findOne({
      where: { request_id: requestId },
      include: [{ model: ResourceAvailability }]
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    // Check if requested quantity is still available
    if (request.requested_quantity > request.resourceAvailability.available_quantity) {
      return res.status(400).json({ error: "Requested quantity no longer available" });
    }

    // Update request status
    request.status = "approved";
    await request.save();

    // Update resource availability
    await ResourceAvailability.update(
      { 
        available_quantity: request.resourceAvailability.available_quantity - request.requested_quantity 
      },
      { 
        where: { availability_id: request.availability_id } 
      }
    );

    res.status(200).json({ message: "Bulk request approved successfully" });
  } catch (error) {
    console.error("Error approving bulk request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const rejectBulkRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BulkRequest.findOne({
      where: { request_id: requestId }
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    request.status = "rejected";
    await request.save();

    res.status(200).json({ message: "Bulk request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting bulk request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addResource = async (req, res) => {
  try {
    const { lab_id, type, quantity = 1 } = req.body;

    if (!lab_id || !type) {
      return res.status(400).json({ error: "Lab ID and type are required" });
    }

    const newAvailability = await ResourceAvailability.create({
      lab_id,
      resource_type: type,
      total_quantity: quantity,
      available_quantity: quantity
    });

    res.status(201).json({ 
      message: "Resource added successfully", 
      resource: newAvailability 
    });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
