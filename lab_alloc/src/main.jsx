import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./main_app.jsx";
import NewSession from "./components/new_session.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
