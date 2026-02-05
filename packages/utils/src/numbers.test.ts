import { describe, expect, it } from "vitest";

import { formatDollarAmount, formatAmount } from "./number";

describe("#numbers", () => {
  describe("#formatDollarAmount", () => {
    it("succeeds", () => {
      expect(formatDollarAmount(0)).toEqual("$0.00");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(undefined)).toEqual("-");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(0.00000123)).toEqual("<$0.01");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(0.000100123)).toEqual("<$0.01");
    });
  });

  describe("#formatAmount", () => {
    it("succeeds", () => {
      expect(formatAmount(0)).toEqual("0.00");
    });

    it("succeeds", () => {
      expect(formatAmount(undefined)).toEqual("-");
    });

    it("succeeds", () => {
      expect(formatAmount(0.00000123)).toEqual("<0.00001");
    });

    it("succeeds", () => {
      expect(formatAmount(234.3234)).toEqual("234.3234");
    });

    it("succeeds", () => {
      expect(formatAmount(1234.3234)).toEqual("1.23K");
    });

    it("succeeds", () => {
      expect(formatAmount(0.000100123)).toEqual("0.0001");
    });
  });
});
