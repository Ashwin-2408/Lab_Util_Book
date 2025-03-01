import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";
// hj

export const releaseResource = async (req, res) => {
  try {
    const { requestId } = req.params;

    // Find the resource request
    const resourceRequest = await ResourceRequest.findOne({
      where: { request_id: requestId, status: "Approved" },
    });

    if (!resourceRequest) {
      return res
        .status(404)
        .json({ message: "Resource request not found or not approved" });
    }

    // Update the resource request status to "Released"
    await ResourceRequest.update(
      { status: "Released" },
      { where: { request_id: requestId } }
    );

    // Update the resource status to "Available"
    await Resource.update(
      { status: "Available" },
      { where: { resource_id: resourceRequest.resource_id } }
    );

    res.status(200).json({ message: "Resource released successfully" });
  } catch (error) {
    console.error("Error releasing resource:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
