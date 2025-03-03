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

    // Fetch available resources along with lab name
    const resources = await Resource.findAll({
      where: {
        status: "Available",
        type: { [Op.like]: `%${resourceType}%` },
      },
      include: [
        {
          model: Lab,
          as: "lab",
          where: { lab_name: { [Op.like]: `%${labName}%` } },
          attributes: ["lab_name"], // ✅ Fetch lab name
        },
      ],
      attributes: ["resource_id", "type"], // ✅ Fetch resource_id and type
    });

    // Format response to include resource ID, type, and lab name
    const formattedResources = resources.map((resource) => ({
      resource_id: resource.resource_id,
      type: resource.type,
      lab_name: resource.lab.lab_name, // ✅ Access the lab name from the relation
    }));

    res.status(200).json({
      quantity: formattedResources.length, // Total count of available resources
      resources: formattedResources, // List of resource details
    });
  } catch (error) {
    console.error("Error fetching resource data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
