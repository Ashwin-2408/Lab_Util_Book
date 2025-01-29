import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./main_app.jsx";
import StatsTable from "./components/stats_table.jsx";
import LabAllocation from "./components/lab_allocation.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);