import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAvailableResources } from "../Controllers/Resource_Controller.js";
import Resource from "../Schema/Resource.js";
import Lab from "../Schema/Lab.js";
import { Op } from "sequelize";

// Mock the Sequelize models
vi.mock("../Schema/Resource.js", () => ({
  default: {
    findAll: vi.fn(),
  },
}));

vi.mock("../Schema/Lab.js", () => ({
  default: {},
}));

vi.mock("sequelize", () => ({
  Op: {
    like: "like",
  },
}));

describe("getAvailableResources Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock request and response objects
    req = {
      body: {
        labName: "Chemistry",
        resourceType: "Microscope",
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

  it("should return available resources with correct formatting", async () => {
    // Setup mock data
    const mockResources = [
      {
        resource_id: "res123",
        type: "Microscope",
        lab: {
          lab_name: "Chemistry Lab",
        },
      },
      {
        resource_id: "res456",
        type: "Microscope Pro",
        lab: {
          lab_name: "Chemistry Lab",
        },
      },
    ];

    // Setup the mock function to return our test data
    Resource.findAll.mockResolvedValue(mockResources);

    // Call the controller function
    await getAvailableResources(req, res);

    // Assertions
    expect(Resource.findAll).toHaveBeenCalledWith({
      where: {
        status: "Available",
        type: { [Op.like]: "%Microscope%" },
      },
      include: [
        {
          model: Lab,
          as: "lab",
          where: { lab_name: { [Op.like]: "%Chemistry%" } },
          attributes: ["lab_name"],
        },
      ],
      attributes: ["resource_id", "type"],
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      quantity: 2,
      resources: [
        {
          resource_id: "res123",
          type: "Microscope",
          lab_name: "Chemistry Lab",
        },
        {
          resource_id: "res456",
          type: "Microscope Pro",
          lab_name: "Chemistry Lab",
        },
      ],
    });
  });

  it("should return 400 when labName is missing", async () => {
    // Setup request with missing labName
    req.body = {
      resourceType: "Microscope",
    };

    await getAvailableResources(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "labName and resourceType are required",
    });
    expect(Resource.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 when resourceType is missing", async () => {
    // Setup request with missing resourceType
    req.body = {
      labName: "Chemistry",
    };

    await getAvailableResources(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "labName and resourceType are required",
    });
    expect(Resource.findAll).not.toHaveBeenCalled();
  });

  it("should return 400 when both parameters are missing", async () => {
    // Setup request with both parameters missing
    req.body = {};

    await getAvailableResources(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "labName and resourceType are required",
    });
    expect(Resource.findAll).not.toHaveBeenCalled();
  });

  it("should return empty array when no resources match criteria", async () => {
    // Setup the mock function to return empty array
    Resource.findAll.mockResolvedValue([]);

    await getAvailableResources(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      quantity: 0,
      resources: [],
    });
  });

  it("should return 500 when database query fails", async () => {
    // Setup the mock function to throw an error
    const errorMessage = "Database connection error";
    Resource.findAll.mockRejectedValue(new Error(errorMessage));

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await getAvailableResources(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching resource data:",
      expect.any(Error)
    );

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
