import { Op } from "sequelize";
import Resource from "../Schema/Resource.js";
import Lab from "../Schema/Lab.js";

export const getAvailableResources = async (req, res) => {
  try {
    const { labName, resourceType } = req.body; // ✅ Read from request body

    if (!labName || !resourceType) {
      return res
        .status(400)
        .json({ error: "labName and resourceType are required" });
    }

    // Fetch available resources along with their IDs
    const resources = await Resource.findAll({
      where: {
        status: "Available",
        type: { [Op.like]: `%${resourceType}%` },
      },
      include: [
        {
          model: Lab,
          as: "Lab",
          where: { lab_name: { [Op.like]: `%${labName}%` } },
          attributes: [],
        },
      ],
      attributes: ["resource_id"], // Fetch only resource_id
    });

    // Extract resource IDs
    const resourceIds = resources.map((resource) => resource.resource_id);

    res.status(200).json({
      quantity: resourceIds.length, // Total count of available resources
      resourceIds, // List of resource IDs
    });
  } catch (error) {
    console.error("Error fetching resource count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
