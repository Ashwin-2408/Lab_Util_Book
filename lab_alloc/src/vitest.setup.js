import { vi } from "vitest";
import axios from "axios";

vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});