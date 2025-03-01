import Resource from "../Schema/Resource.js";
import ResourceRequest from "../Schema/ResourceRequest.js";
// asdfhas

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
          attributes: ["resource_id", "status", "createdAt"],
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
