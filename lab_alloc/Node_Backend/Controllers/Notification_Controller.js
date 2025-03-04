import Notification from "../Schema/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [
        ["isRead", "ASC"], 
        ["timestamp", "DESC"], 
      ],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};


export const createNotification = async (req, res) => {
  try {
    const { type, title, message, timestamp, category } = req.body;

    if (!type || !title || !message || !timestamp || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newNotification = await Notification.create({
      type,
      title,
      message,
      timestamp,
      category,
    });

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: "Failed to create notification" });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await notification.update({ isRead: true });

    const updatedNotification = await Notification.findByPk(id);

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const updatedCount = await Notification.update(
      { isRead: true },
      { where: { isRead: false } } 
    );

    res.status(200).json({ message: "All notifications marked as read", updatedCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};




export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Notification.destroy({ where: { id } });

    if (deleted) {
      return res.status(200).json({ message: "Notification deleted successfully" });
    } else {
      return res.status(404).json({ error: "Notification not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: {}, 
      truncate: true 
    });
    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.error("Failed to delete all notifications:", error);
    res.status(500).json({ error: "Failed to delete all notifications" });
  }
};