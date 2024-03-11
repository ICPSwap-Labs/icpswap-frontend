import { formatDollarAmount } from "./number";

describe("#numbers", () => {
  describe("#formatDollarAmount", () => {
    it("succeeds", () => {
      expect(formatDollarAmount(0)).toEqual("$0.00");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(undefined)).toEqual("-");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(0.00000123)).toEqual("$0.0000012");
    });

    it("succeeds", () => {
      expect(formatDollarAmount(0.000100123)).toEqual("$0.0001");
    });
  });
});
