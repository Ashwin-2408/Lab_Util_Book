import { render, screen, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import axios from "axios";
import Audit from "../components/comp_v/Audit";
import "@testing-library/jest-dom";

vi.mock("axios");

describe("Audit Component", () => {
  const mockAuditData = {
    data: [
      {
        id: 1,
        username: "user1",
        status: "approved",
        schedule_date: "2025-03-24T10:00:00Z",
        approved_by: "admin1",
      },
      {
        id: 2,
        username: "user2",
        status: "rejected",
        schedule_date: "2025-03-23T14:00:00Z",
        approved_by: "admin2",
      },
    ],
    total: 20,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Audit component with fetched data", async () => {
    axios.get.mockResolvedValueOnce({
      data: mockAuditData,
    });

    await act(async () => {
      render(<Audit />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(/Audit Log/i)).toBeInTheDocument();
    expect(screen.getByText(/user1/i)).toBeInTheDocument();
    expect(screen.getByText(/user2/i)).toBeInTheDocument();
  });
});