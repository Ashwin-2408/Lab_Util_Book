import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Confirm that the root element exists
const container = document.getElementById("root");
if (!container) {
  console.error("Root element not found!");
} else {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
