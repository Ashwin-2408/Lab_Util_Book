import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainApp from "./main_app.jsx";
import Card from "./components/card.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Card />
  </StrictMode>
);
