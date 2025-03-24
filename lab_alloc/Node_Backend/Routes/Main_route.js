import { Router } from "express";
import Resource_Router from "./Resource_Routes.js";
import Lab from "../Schema/Lab.js"; 

const router = Router();

router.use("/resource", Resource_Router);

// GET all Labs using Sequelize
router.get("/labs", async (req, res) => {
  try {
    const labs = await Lab.findAll(); // Fetch all labs
    res.json(labs);
  } catch (error) {
    console.error("Error fetching labs:", error);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
