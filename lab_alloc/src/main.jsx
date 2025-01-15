import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import NewSession from "./components/new_session.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NewSession />
  </StrictMode>
);
