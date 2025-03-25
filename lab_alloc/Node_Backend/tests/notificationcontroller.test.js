import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotifications, createNotification, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } from "../Controllers/Notification_Controller.js";
import Notification from "../Schema/Notification.js";

vi.mock("../Schema/Notification.js");

describe("Notification Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch all notifications ordered correctly", async () => {
    const mockNotifications = [
      { id: 1, isRead: false, timestamp: new Date() },
      { id: 2, isRead: true, timestamp: new Date() },
    ];
    Notification.findAll.mockResolvedValue(mockNotifications);

    const req = {};
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    await getNotifications(req, res);

    expect(Notification.findAll).toHaveBeenCalledWith({
      order: [["isRead", "ASC"], ["timestamp", "DESC"]],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockNotifications);
  });

  it("should create a new notification", async () => {
    const mockRequest = {
      body: { type: "info", title: "New", message: "Test", timestamp: new Date(), category: "general" },
    };
    const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const createdNotification = { id: 1, ...mockRequest.body };

    Notification.create.mockResolvedValue(createdNotification);

    await createNotification(mockRequest, mockResponse);

    expect(Notification.create).toHaveBeenCalledWith(mockRequest.body);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(createdNotification);
  });

  it("should mark a notification as read", async () => {
    const mockRequest = { params: { id: 1 } };
    const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const mockNotification = { update: vi.fn(), id: 1, isRead: false };

    Notification.findByPk.mockResolvedValue(mockNotification);
    mockNotification.update.mockResolvedValue();
    Notification.findByPk.mockResolvedValue({ ...mockNotification, isRead: true });

    await markAsRead(mockRequest, mockResponse);

    expect(Notification.findByPk).toHaveBeenCalledWith(1);
    expect(mockNotification.update).toHaveBeenCalledWith({ isRead: true });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ ...mockNotification, isRead: true });
  });

  it("should mark all notifications as read", async () => {
    const mockRequest = {};
    const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Notification.update.mockResolvedValue([5]);

    await markAllAsRead(mockRequest, mockResponse);

    expect(Notification.update).toHaveBeenCalledWith({ isRead: true }, { where: { isRead: false } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "All notifications marked as read", updatedCount: [5] });
  });

  it("should delete a notification", async () => {
    const mockRequest = { params: { id: 1 } };
    const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Notification.destroy.mockResolvedValue(1);

    await deleteNotification(mockRequest, mockResponse);

    expect(Notification.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Notification deleted successfully" });
  });

  it("should delete all notifications", async () => {
    const mockRequest = {};
    const mockResponse = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    Notification.destroy.mockResolvedValue();

    await deleteAllNotifications(mockRequest, mockResponse);

    expect(Notification.destroy).toHaveBeenCalledWith({ where: {}, truncate: true });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "All notifications deleted successfully" });
  });
});