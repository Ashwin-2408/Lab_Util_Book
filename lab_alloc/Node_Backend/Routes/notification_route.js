import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification, // Add this function in the controller
} from "../Controllers/Notification_Controller.js";

const router = Router();

router.get("/notifications", getNotifications);
router.post("/notifications", createNotification);
router.patch("/notifications/:id", markAsRead);
router.delete("/notifications/:id", deleteNotification); // New delete route

export default router;
