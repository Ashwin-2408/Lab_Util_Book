import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./main_app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
