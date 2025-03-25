import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import {
  getPendingRequests,
  approveRequest,
  rejectRequest,
  addResource,
} from "../Controllers/AdminController.js";
import ResourceRequest from "../Schema/ResourceRequest.js";
import Resource from "../Schema/Resource.js";

// Mocking modules using Vitest
vi.mock("../Schema/ResourceRequest.js", () => ({
  default: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../Schema/Resource.js", () => ({
  default: {
    update: vi.fn(),
    create: vi.fn(), // Ensure create is mocked
  },
}));

// Express setup
const app = express();
app.use(express.json());
app.get("/pending-requests", getPendingRequests);
app.post("/approve/:requestId", approveRequest);
app.post("/reject/:requestId", rejectRequest);
app.post("/add-resource", addResource);

describe("Admin Controller API", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it("should fetch pending requests", async () => {
    ResourceRequest.findAll.mockResolvedValue([
      { request_id: 1, status: "Pending" },
    ]);

    const response = await request(app).get("/pending-requests");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ request_id: 1, status: "Pending" }]);
  });

  it("should approve a request", async () => {
    ResourceRequest.findOne.mockResolvedValue({
      save: vi.fn(),
      status: "Pending",
      resource_id: 1,
    });
    Resource.update.mockResolvedValue([1]);

    const response = await request(app).post("/approve/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Request approved successfully" });
  });

  it("should reject a request", async () => {
    ResourceRequest.findOne.mockResolvedValue({
      save: vi.fn(),
      status: "Pending",
    });

    const response = await request(app).post("/reject/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Request rejected successfully" });
  });

  it("should add a resource", async () => {
    Resource.create.mockResolvedValue({
      lab_id: 101,
      type: "i5",
      status: "Available",
    });

    const response = await request(app).post("/add-resource").send({
      lab_id: 101,
      type: "i5",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Resource added successfully",
      resource: { lab_id: 101, type: "i5", status: "Available" },
    });
  });
});
