import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, it, expect } from "vitest";

test("renders learn react link", () => {
  render(<App />);
});