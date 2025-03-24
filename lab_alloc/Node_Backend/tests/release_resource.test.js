import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { releaseResource } from "../Controllers/Release_Resources.js";
import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";

// Mock the Sequelize models
vi.mock("../Schema/ResourceRequest.js", () => ({
  default: {
    findOne: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("../Schema/Resource.js", () => ({
  default: {
    update: vi.fn(),
  },
}));

describe("releaseResource Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock request and response objects
    req = {
      params: {
        requestId: "req123",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should successfully release a resource", async () => {
    // Mock successful resource request lookup
    const mockResourceRequest = {
      request_id: "req123",
      resource_id: "res456",
      status: "Approved",
    };

    ResourceRequest.findOne.mockResolvedValue(mockResourceRequest);
    ResourceRequest.update.mockResolvedValue([1]); // 1 row affected
    Resource.update.mockResolvedValue([1]); // 1 row affected

    await releaseResource(req, res);

    // Check that findOne was called with correct parameters
    expect(ResourceRequest.findOne).toHaveBeenCalledWith({
      where: { request_id: "req123", status: "Approved" },
    });

    // Check that updates were called with correct parameters
    expect(ResourceRequest.update).toHaveBeenCalledWith(
      { status: "Released" },
      { where: { request_id: "req123" } }
    );

    expect(Resource.update).toHaveBeenCalledWith(
      { status: "Available" },
      { where: { resource_id: "res456" } }
    );

    // Check response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resource released successfully",
    });
  });

  it("should return 404 when resource request is not found", async () => {
    // Mock resource request not found
    ResourceRequest.findOne.mockResolvedValue(null);

    await releaseResource(req, res);

    // Check response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resource request not found or not approved",
    });

    // Ensure updates were not attempted
    expect(ResourceRequest.update).not.toHaveBeenCalled();
    expect(Resource.update).not.toHaveBeenCalled();
  });

  it("should return 404 when resource request is not in approved status", async () => {
    // Mock resource request with non-approved status
    const mockResourceRequest = {
      request_id: "req123",
      resource_id: "res456",
      status: "Pending", // Not approved
    };

    ResourceRequest.findOne.mockResolvedValue(null); // Will return null due to status filter

    await releaseResource(req, res);

    // Check response
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Resource request not found or not approved",
    });

    // Ensure updates were not attempted
    expect(ResourceRequest.update).not.toHaveBeenCalled();
    expect(Resource.update).not.toHaveBeenCalled();
  });

  it("should handle errors during resource request lookup", async () => {
    // Mock error during findOne
    const errorMessage = "Database connection error";
    ResourceRequest.findOne.mockRejectedValue(new Error(errorMessage));

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await releaseResource(req, res);

    // Check proper error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error releasing resource:",
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("should handle errors during resource request update", async () => {
    // Mock successful lookup but failed update
    const mockResourceRequest = {
      request_id: "req123",
      resource_id: "res456",
      status: "Approved",
    };

    ResourceRequest.findOne.mockResolvedValue(mockResourceRequest);
    ResourceRequest.update.mockRejectedValue(new Error("Update failed"));

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await releaseResource(req, res);

    // Check proper error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error releasing resource:",
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("should handle errors during resource update", async () => {
    // Mock successful request lookup and update but failed resource update
    const mockResourceRequest = {
      request_id: "req123",
      resource_id: "res456",
      status: "Approved",
    };

    ResourceRequest.findOne.mockResolvedValue(mockResourceRequest);
    ResourceRequest.update.mockResolvedValue([1]);
    Resource.update.mockRejectedValue(new Error("Resource update failed"));

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await releaseResource(req, res);

    // Check proper error handling
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error releasing resource:",
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
