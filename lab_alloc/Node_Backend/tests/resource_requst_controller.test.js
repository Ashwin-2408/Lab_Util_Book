import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import {
  requestResource,
  getUserRequests,
} from "../Controllers/Resource_Request_Controller.js";
import Resource from "../Schema/Resource.js";
import ResourceRequest from "../Schema/ResourceRequest.js";
import Lab from "../Schema/Lab.js";

// Mocking the database models
vi.mock("../Schema/Resource.js", () => ({
  default: {
    findOne: vi.fn(),
  },
}));

vi.mock("../Schema/ResourceRequest.js", () => ({
  default: {
    create: vi.fn(),
    findAll: vi.fn(),
  },
}));

vi.mock("../Schema/Lab.js", () => ({
  default: {},
}));

// Setup Express app with routes for testing
const app = express();
app.use(express.json());
app.post("/request-resource", requestResource);
app.get("/user-requests", getUserRequests);

describe("ResourceController API", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  // ✅ Test case for requesting a resource successfully
  it("should create a new resource request successfully", async () => {
    Resource.findOne.mockResolvedValue({ resource_id: 1, status: "Available" });
    ResourceRequest.create.mockResolvedValue({
      request_id: 101,
      status: "Pending",
    });

    const response = await request(app).post("/request-resource").send({
      resourceId: 1,
      userId: 10,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Resource request submitted successfully",
      requestId: 101,
      status: "Pending",
    });
  });

  // ❌ Test case for missing fields in request body
  it("should return 400 error if resourceId or userId is missing", async () => {
    const response = await request(app).post("/request-resource").send({
      resourceId: 1,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "resourceId and userId are required",
    });
  });

  // ❌ Test case for requesting an unavailable resource
  it("should return 404 if the resource is not available", async () => {
    Resource.findOne.mockResolvedValue(null);

    const response = await request(app).post("/request-resource").send({
      resourceId: 5,
      userId: 10,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Resource not available" });
  });

  // ✅ Test case for fetching user requests successfully
  it("should return user requests if they exist", async () => {
    ResourceRequest.findAll.mockResolvedValue([
      {
        request_id: 101,
        user_id: 10,
        status: "Pending",
        Resource: {
          resource_id: 1,
          status: "Available",
          createdAt: "2024-03-01T10:00:00Z",
          type: "Laptop",
          Lab: { lab_name: "CS Lab" },
        },
      },
    ]);

    const response = await request(app)
      .get("/user-requests")
      .send({ userId: 10 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        request_id: 101,
        user_id: 10,
        status: "Pending",
        Resource: {
          resource_id: 1,
          status: "Available",
          createdAt: "2024-03-01T10:00:00Z",
          type: "Laptop",
          Lab: { lab_name: "CS Lab" },
        },
      },
    ]);
  });

  // ❌ Test case when userId is missing in request body
  it("should return 400 error if userId is missing", async () => {
    const response = await request(app).get("/user-requests").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "userId is required" });
  });

  // ❌ Test case when no requests are found for a user
  it("should return 404 if no requests exist for the user", async () => {
    ResourceRequest.findAll.mockResolvedValue([]);

    const response = await request(app)
      .get("/user-requests")
      .send({ userId: 99 });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "No requests found for this user" });
  });
});
