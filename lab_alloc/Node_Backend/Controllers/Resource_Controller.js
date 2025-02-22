import { Op } from "sequelize";
import Resource from "../models/Resource.js";
import Lab from "../models/Lab.js";

// Get count of available resources with optional filters
export const getAvailableResources = async (req, res) => {
  try {
    const { labName, resourceType } = req.query;

    const whereClause = { status: "Available" };

    if (labName) {
      whereClause["$Lab.lab_name$"] = { [Op.like]: `%${labName}%` };
    }
    if (resourceType) {
      whereClause.type = { [Op.like]: `%${resourceType}%` };
    }

    const resourceCount = await Resource.count({
      where: whereClause,
      include: [
        {
          model: Lab,
          attributes: ["lab_name"],
        },
      ],
    });

    res.status(200).json({ quantity: resourceCount });
  } catch (error) {
    console.error("Error fetching resource count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
