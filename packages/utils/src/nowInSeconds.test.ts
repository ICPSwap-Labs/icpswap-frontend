import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nowInSeconds } from "./nowInSeconds";

describe("nowInSeconds", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns current time in seconds", () => {
    vi.setSystemTime(new Date("2025-02-04T12:00:00.000Z"));
    expect(nowInSeconds()).toBe(Math.floor(Date.now() / 1000));
  });
});
