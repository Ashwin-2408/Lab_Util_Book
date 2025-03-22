import { Router } from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications, 
} from "../Controllers/Notification_Controller.js";

const router = Router();

router.get("/", getNotifications);
router.post("/", createNotification);
router.patch("/:id", markAsRead);
router.patch("/",markAllAsRead);
router.delete("/:id", deleteNotification); 
router.delete("/", deleteAllNotifications);

export default router;