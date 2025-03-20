import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";
// absj

export const getPendingRequests = async (req, res) => {
  try {
    const pendingRequests = await ResourceRequest.findAll({
      where: { status: "Pending" },
      include: [{ model: Resource }],
    });

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ResourceRequest.findOne({
      where: { request_id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    request.status = "Approved";
    await request.save();

    await Resource.update(
      { status: "Allocated" },
      { where: { resource_id: request.resource_id } }
    );

    res.status(200).json({ message: "Request approved successfully" });
  } catch (error) {
    console.error("Error approving request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await ResourceRequest.findOne({
      where: { request_id: requestId },
    });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request is not pending" });
    }

    request.status = "Rejected";
    await request.save();

    res.status(200).json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addResource = async (req, res) => {
  try {
    const { lab_id, type, status } = req.body;

    if (!lab_id || !type) {
      return res.status(400).json({ error: "Lab ID and type are required" });
    }

    if (!["i3", "i5", "i7"].includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid type. Must be i3, i5, or i7" });
    }

    const newResource = await Resource.create({
      lab_id,
      type,
      status: status || "Available", // Default status
    });

    res
      .status(201)
      .json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    console.error("Error adding resource:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
