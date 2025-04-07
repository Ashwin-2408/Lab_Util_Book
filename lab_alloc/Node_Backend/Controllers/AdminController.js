import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";
import BulkRequest from "../Schema/BulkRequest.js";
// Update the import statement
import BulkResourceAvailability from "../Schema/BulkResourceAvailability.js";
import Lab from "../Schema/Lab.js";

export const getPendingRequests = async (req, res) => {
  try {
    const bulkRequests = await BulkRequest.findAll({
      include: [
        { 
          model: BulkResourceAvailability,  // Changed from ResourceAvailability
          as: 'resourceAvailability',
          include: [
            { 
              model: Lab,
              as: 'lab'
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
    const requestId = req.params.requestId; // Changed from id to requestId
    
    const bulkRequest = await BulkRequest.findOne({
      where: { request_id: requestId },
      include: [{
        model: BulkResourceAvailability,
        as: 'resourceAvailability',
        include: [{
          model: Lab,
          as: 'lab'
        }]
      }]
    });

    if (!bulkRequest) {
      return res.status(404).json({ error: "Bulk request not found" });
    }

    // Update request status
    await bulkRequest.update({ status: 'approved' });

    // Update available quantity in BulkResourceAvailability
    const availability = bulkRequest.resourceAvailability;
    if (availability) {
      const newQuantity = availability.available_quantity - bulkRequest.requested_quantity;
      await availability.update({ available_quantity: newQuantity });
    }

    res.json({ 
      message: "Bulk request approved successfully",
      request: bulkRequest 
    });

  } catch (error) {
    console.error('Error in approveBulkRequest:', error);
    res.status(500).json({ 
      error: "Failed to approve bulk request",
      details: error.message 
    });
  }
};

export const rejectBulkRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await BulkRequest.findOne({
      where: { request_id: requestId },
      include: [{
        model: BulkResourceAvailability,
        as: 'resourceAvailability'
      }]
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    // Update the available quantity and pending quantity in BulkResourceAvailability
    const availability = request.resourceAvailability;
    if (availability) {
      const newAvailableQuantity = availability.available_quantity + request.requested_quantity;
      const newPendingQuantity = availability.pending_quantity - request.requested_quantity;
      await availability.update({ 
        available_quantity: newAvailableQuantity,
        pending_quantity: newPendingQuantity
      });
    }

    // Update request status
    request.status = "rejected";
    await request.save();

    res.status(200).json({ 
      message: "Bulk request rejected successfully",
      request: request
    });
  } catch (error) {
    console.error("Error rejecting bulk request:", error);
    res.status(500).json({ 
      error: "Failed to reject request",
      details: error.message 
    });
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
