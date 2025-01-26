import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./main_app.jsx";
import Stats from "./components/stats.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Stats />
  </StrictMode>
);
