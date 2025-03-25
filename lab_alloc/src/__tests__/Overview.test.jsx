import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import OverviewSection from "../components/comp_v/Overview"; // Adjust import path
import { Beaker, PackageOpen } from "lucide-react";

describe("OverviewSection Component", () => {
  const defaultProps = {
    totalLabs: 10,
    active: 5,
    pending: 3,
  };

  it("renders all overview cards", () => {
    render(<OverviewSection {...defaultProps} />);

    const expectedLabels = [
      "Total Labs",
      "Total Resources",
      "Active Bookings",
      "Pending Requests",
    ];

    expectedLabels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays correct values for each card", () => {
    render(<OverviewSection {...defaultProps} />);

    const cardContents = [
      { label: "Total Labs", value: "10" },
      { label: "Total Resources", value: "4" },
      { label: "Active Bookings", value: "5" },
      { label: "Pending Requests", value: "3" },
    ];

    cardContents.forEach(({ label, value }) => {
      const cardElement = screen.getByText(label).closest(".overview-card");
      expect(cardElement).toHaveTextContent(value);
    });
  });

  it("handles zero or undefined prop values", () => {
    const zeroProps = {
      totalLabs: 0,
      active: 0,
      pending: 0,
    };

    render(<OverviewSection {...zeroProps} />);
    const cardContents = [
      { label: "Total Labs", value: "0" },
      { label: "Active Bookings", value: "0" },
      { label: "Pending Requests", value: "0" },
    ];

    cardContents.forEach(({ label, value }) => {
      const cardElement = screen.getByText(label).closest(".overview-card");
      expect(cardElement).toHaveTextContent(value);
    });
  });
});
