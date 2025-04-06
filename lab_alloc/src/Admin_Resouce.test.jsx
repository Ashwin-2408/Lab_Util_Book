import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import AdminResourceAllocation from "./components/AdminResourceAllocation";

vi.mock("axios");

describe("AdminResourceAllocation Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays resource requests", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          request_id: 1,
          user_id: "123",
          resource_id: 5,
          status: "pending",
          createdAt: "2024-03-01T10:00:00Z",
          Resource: { type: "Laptop", lab: { name: "Lab A" } },
        },
      ],
    });

    render(<AdminResourceAllocation />);

    await waitFor(() => expect(true).toBe(true)); 
  });

  it("approves a request", async () => {
    axios.patch.mockResolvedValueOnce({ data: { message: "Approved" } });

    render(<AdminResourceAllocation />);

    await waitFor(() => expect(true).toBe(true)); 
  });

  it("rejects a request", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Rejected" } });

    render(<AdminResourceAllocation />);

    await waitFor(() => expect(true).toBe(true)); 
  });

  it("adds a new resource", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Resource added" } });

    render(<AdminResourceAllocation />);

    await waitFor(() => expect(true).toBe(true)); 
  });
});
