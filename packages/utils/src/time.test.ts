import { SECONDS_IN_DAY } from "@icpswap/constants";
import { describe, expect, it } from "vitest";

import {
  daysToSeconds,
  getLocalDayEndMs,
  getLocalDayStartMs,
  getTimeRangeForPastDays,
  millisecond2Nanosecond,
  nanosecond2Millisecond,
  secondsToDays,
  timestampFormat,
  toUnixTimestamp,
} from "./time";

describe("time", () => {
  describe("nanosecond2Millisecond", () => {
    it("divides nanoseconds by 1e6", () => {
      expect(nanosecond2Millisecond(1_500_000n)).toBe(1);
      expect(nanosecond2Millisecond(999_999n)).toBe(0);
    });
  });

  describe("millisecond2Nanosecond", () => {
    it("multiplies milliseconds by 1e6", () => {
      expect(millisecond2Nanosecond(2)).toBe(2_000_000);
    });
  });

  describe("timestampFormat", () => {
    it("returns empty string for falsy timestamp", () => {
      expect(timestampFormat(0)).toBe("");
    });

    it("formats epoch milliseconds with default pattern", () => {
      expect(timestampFormat(1_700_000_000_000)).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it("respects custom format", () => {
      expect(timestampFormat(1_700_000_000_000, "YYYY-MM-DD")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("secondsToDays / daysToSeconds", () => {
    it("converts seconds to days", () => {
      expect(secondsToDays(SECONDS_IN_DAY)).toBe(1);
    });

    it("converts days to seconds", () => {
      expect(daysToSeconds(1)).toBe(SECONDS_IN_DAY);
    });
  });

  describe("toUnixTimestamp", () => {
    it("divides millisecond timestamp by 1000", () => {
      expect(toUnixTimestamp(1_700_000_000_000)).toBe(1_700_000_000);
    });
  });

  describe("getLocalDayStartMs / getLocalDayEndMs", () => {
    it("start is at local midnight and end is same calendar day", () => {
      const sample = Date.now();
      const start = getLocalDayStartMs(sample);
      const end = getLocalDayEndMs(sample);
      expect(start).toBeLessThanOrEqual(sample);
      expect(sample).toBeLessThanOrEqual(end);
      expect(end - start).toBeGreaterThan(0);
    });
  });

  describe("getTimeRangeForPastDays", () => {
    it("returns a window of `days` ending at `end` when provided", () => {
      const end = 1_700_000_000_000;
      const days = 7;
      const msPerDay = 24 * 60 * 60 * 1000;
      const { start, end: rangeEnd } = getTimeRangeForPastDays(days, end);

      expect(rangeEnd).toBe(end);
      expect(start).toBe(end - days * msPerDay);
    });

    it("defaults end to current time when omitted", () => {
      const before = Date.now();
      const { start, end } = getTimeRangeForPastDays(1);
      const after = Date.now();

      expect(end).toBeGreaterThanOrEqual(before);
      expect(end).toBeLessThanOrEqual(after);
      expect(end - start).toBe(24 * 60 * 60 * 1000);
    });
  });
});
