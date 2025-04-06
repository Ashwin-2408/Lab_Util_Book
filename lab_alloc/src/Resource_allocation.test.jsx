import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import ResourceAllocation from "./components/Resource_allocation";

// Mock axios
vi.mock("axios");

describe("ResourceAllocation Component", () => {
  // Mock data for testing
  const mockResources = [
    {
      resource_id: 1,
      type: "Computer System",
      lab_name: "Computer Lab A",
      available: true
    },
    {
      resource_id: 2,
      type: "Microscope",
      lab_name: "Biology Lab",
      available: true
    }
  ];

  const mockUserRequests = [
    {
      request_id: 1,
      resource_id: 1,
      status: "pending",
      type: "Computer System",
      lab_name: "Computer Lab A"
    }
  ];

  // Setup mock user ID
  const currentUserId = 1;

  beforeEach(() => {
    vi.resetAllMocks();
    
    // Default mock implementations
    axios.post.mockImplementation((url) => {
      if (url.includes("/resource/available")) {
        return Promise.resolve({ data: { resources: mockResources } });
      }
      if (url.includes("/resource/requests/user")) {
        return Promise.resolve({ data: mockUserRequests });
      }
      return Promise.resolve({});
    });
  });

  it("fetches and displays available resources", async () => {
    render(<ResourceAllocation />);

    // Wait for resources to load
    await waitFor(() => {
      expect(screen.getByText("Computer System")).toBeInTheDocument();
      expect(screen.getByText("Microscope")).toBeInTheDocument();
    });
  });

  it("searches resources by lab and type", async () => {
    render(<ResourceAllocation />);

    const labInput = screen.getByLabelText("Lab");
    const resourceInput = screen.getByLabelText("Resource");

    // Simulate user searching
    fireEvent.change(labInput, { target: { value: "Computer Lab A" } });
    fireEvent.change(resourceInput, { target: { value: "Computer System" } });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3001/resource/available",
        {
          labName: "Computer Lab A",
          resourceType: "Computer System"
        }
      );
    });
  });

  it("requests a resource successfully", async () => {
    // Mock successful resource request
    axios.post.mockImplementation((url, data) => {
      if (url.includes("/resource/request")) {
        return Promise.resolve({
          data: {
            requestId: 2,
            status: "pending",
            message: "Resource requested successfully"
          }
        });
      }
      return Promise.resolve({ data: mockResources });
    });

    render(<ResourceAllocation />);

    // Wait for resources to load
    await waitFor(() => {
      const requestButtons = screen.getAllByText("Request");
      expect(requestButtons.length).toBeGreaterThan(0);
    });

    // Click first request button
    const requestButton = screen.getAllByText("Request")[0];
    fireEvent.click(requestButton);

    // Wait for request to be processed
    await waitFor(() => {
      expect(screen.getByText("Resource requested successfully!")).toBeInTheDocument();
    });
  });

  it("releases a previously approved resource", async () => {
    // Mock user requests with an approved resource
    const approvedRequests = [
      {
        request_id: 1,
        resource_id: 1,
        status: "approved",
        title: "Request for Computer System",
        resource: "Computer System",
        lab: "Computer Lab A"
      }
    ];

    // Mock axios responses
    axios.post.mockImplementation((url) => {
      if (url.includes("/resource/requests/user")) {
        return Promise.resolve({ data: approvedRequests });
      }
      return Promise.resolve({ data: mockResources });
    });

    axios.patch.mockResolvedValue({
      data: {
        message: "Resource released successfully"
      }
    });

    render(<ResourceAllocation />);

    // Wait for requests to load
    await waitFor(() => {
      const releaseButtons = screen.getAllByText("Release Resource");
      expect(releaseButtons.length).toBeGreaterThan(0);
    });

    // Click release button
    const releaseButton = screen.getByText("Release Resource");
    fireEvent.click(releaseButton);

    // Wait for release confirmation
    await waitFor(() => {
      expect(screen.getByText("Resource released successfully!")).toBeInTheDocument();
    });
  });

  it("handles error when fetching resources fails", async () => {
    // Mock a failed resource fetch
    axios.post.mockRejectedValue(new Error("Failed to load resources"));

    render(<ResourceAllocation />);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Failed to load resources. Please try again.")).toBeInTheDocument();
    });
  });

  it("prevents requesting resource when none are available", async () => {
    // Mock empty resources
    axios.post.mockResolvedValue({ data: { resources: [] } });

    render(<ResourceAllocation />);

    // Wait for no results message
    await waitFor(() => {
      expect(screen.getByText("Enter search criteria to find resources.")).toBeInTheDocument();
    });
  });
});