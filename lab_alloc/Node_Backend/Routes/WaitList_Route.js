import express from "express";
import { getWaitlist, addToWaitlist, removeFromWaitlist } from "../Controllers/WaitListController.js";

const router = express.Router();

router.get("/:lab_id", getWaitlist); 
router.post("/", addToWaitlist); 
router.delete("/:lab_id/:user_name", removeFromWaitlist);

export default router;
