import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("../Schema/WaitList.js", () => ({
  default: {
    findAll: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    decrement: vi.fn(),
  },
}));

vi.mock("../Schema/Lab.js", () => ({
  default: {},
}));

import { getWaitlist, addToWaitlist, removeFromWaitlist } from "../Controllers/WaitListController.js";

describe("Waitlist Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the waitlist for a given lab", async () => {
    const req = { params: { lab_id: "1" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    const mockWaitlist = [{ user_name: "John Doe", lab_id: "1", position: 1 }];
    (await import("../Schema/WaitList.js")).default.findAll.mockResolvedValue(mockWaitlist);

    await getWaitlist(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockWaitlist);
  });

  it("should add a user to the waitlist", async () => {
    const req = { body: { user_name: "John Doe", lab_id: "1" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    const Waitlist = (await import("../Schema/WaitList.js")).default;
    Waitlist.findOne.mockResolvedValue(null);
    Waitlist.create.mockResolvedValue({
      user_name: "John Doe",
      lab_id: "1",
      position: 1,
      estimated_wait_time: "10 mins",
      notified: false,
    });

    await addToWaitlist(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should remove a user from the waitlist and adjust positions", async () => {
    const req = { params: { lab_id: "1", user_name: "John Doe" } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };

    const Waitlist = (await import("../Schema/WaitList.js")).default;
    const entry = { position: 2, destroy: vi.fn() };
    Waitlist.findOne.mockResolvedValue(entry);
    Waitlist.decrement.mockResolvedValue();

    await removeFromWaitlist(req, res);

    expect(entry.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
