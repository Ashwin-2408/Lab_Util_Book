import { render, screen, waitFor, act } from "@testing-library/react";
import Dashboard from "../components/comp_v/Dashboard";
import { expect, describe, it } from "vitest";
import { BrowserRouter, MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

describe("Dashboard Component", () => {
  it("renders the component and fetches the stats", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: "Quantum Lab", status: "pending" },
        { id: 2, name: "Quantum Lab", status: "approved" },
        { id: 3, name: "Quantum Lab", status: "pending" },
      ],
    });

    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard totalLabs={10} setPageState={() => {}} />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/total labs/i)).toBeInTheDocument();
      expect(screen.getByText(/total resources/i)).toBeInTheDocument();
      expect(screen.getByText(/active bookings/i)).toBeInTheDocument();
      expect(screen.getByText(/pending requests/i)).toBeInTheDocument();
    });
  });

  // it("Navigates to booking path", async () => {
  //   const user = userEvent.setup(); // Initialize user interaction
  //   axios.get.mockResolvedValueOnce({
  //     data: [
  //       { id: 1, name: "Quantum Lab", status: "pending" },
  //       { id: 2, name: "Quantum Lab", status: "approved" },
  //       { id: 3, name: "Quantum Lab", status: "pending" },
  //     ],
  //   });
  //   render(
  //     <MemoryRouter initialEntries={["/"]}>
  //       <Routes>
  //         <Route
  //           path="/"
  //           element={<Dashboard totalLabs={5} setPageState={vi.fn()} />}
  //         />
  //         <Route path="/book" element={<BookLab />} />
  //       </Routes>
  //     </MemoryRouter>
  //   );

  //   // Assert the Dashboard renders
  //   expect(screen.getByText(/Lab Utilization System/i)).toBeInTheDocument();

  //   // Simulate button click
  //   const bookButton = screen.getByText(/Book a Lab/i);
  //   await user.click(bookButton); // Use `user.click()` instead of `fireEvent`

  //   // Verify redirection by checking if BookLab renders
  //   expect(screen.getByText(/BookLab/i)).toBeInTheDocument();
  // });
});
