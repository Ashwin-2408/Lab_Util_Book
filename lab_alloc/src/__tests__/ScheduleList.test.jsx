import { describe, it, expect } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ScheduleList from "../components/comp_v/ScheduleList";
import { vi } from "vitest";

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children }) => <div>{children}</div>,
  },
}));

const mockCustomSelect = {
  1: { lab_name: "Lab A" },
  2: { lab_name: "Lab B" },
};

const mockMainData = [
  {
    lab_id: 1,
    start_date: "2025-03-20",
    start_time: "10:00",
    end_date: "2025-03-21",
    end_time: "15:00",
    main_reason: "System Upgrade",
  },
  {
    lab_id: 2,
    start_date: "2025-03-25",
    start_time: "09:00",
    end_date: "2025-03-25",
    end_time: "12:00",
    main_reason: "Maintenance Check",
  },
];

describe("ScheduleList Component", () => {
  it("renders the maintenance schedule header", () => {
    render(
      <ScheduleList customSelect={mockCustomSelect} mainData={mockMainData} />
    );

    expect(screen.getByText("All Maintenance Schedules")).toBeInTheDocument();
    expect(screen.getByText("Scheduled Maintenance")).toBeInTheDocument();
  });

  it("renders the correct lab names", () => {
    render(
      <ScheduleList customSelect={mockCustomSelect} mainData={mockMainData} />
    );

    expect(screen.getByText("Lab A")).toBeInTheDocument();
    expect(screen.getByText("Lab B")).toBeInTheDocument();
  });

  it("displays the correct start and end dates with formatted times", () => {
    render(
      <ScheduleList customSelect={mockCustomSelect} mainData={mockMainData} />
    );

    expect(screen.getByText("Mar 20, 2025")).toBeInTheDocument();
    expect(screen.getByText("Mar 21, 2025")).toBeInTheDocument();
  });

  it("displays the correct maintenance reason", () => {
    render(
      <ScheduleList customSelect={mockCustomSelect} mainData={mockMainData} />
    );

    expect(screen.getByText("System Upgrade")).toBeInTheDocument();
    expect(screen.getByText("Maintenance Check")).toBeInTheDocument();
  });

  it("applies the correct status classes", () => {
    render(
      <ScheduleList customSelect={mockCustomSelect} mainData={mockMainData} />
    );

    const statusElements = screen.getAllByText(/completed|upcoming|ongoing/);
    expect(statusElements.length).toBeGreaterThan(0);
  });
});
