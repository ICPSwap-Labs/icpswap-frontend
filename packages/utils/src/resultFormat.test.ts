import { describe, it, expect } from "vitest";
import { isResultKey, isResultErrKey, isResultOkKey, resultFormat } from "./resultFormat";
import { ResultStatus } from "@icpswap/types";

describe("resultFormat helpers", () => {
  describe("isResultErrKey", () => {
    it("returns true for Err keys", () => {
      expect(isResultErrKey("Err")).toBe(true);
      expect(isResultErrKey(ResultStatus.ERROR)).toBe(true);
    });
    it("returns false for Ok", () => {
      expect(isResultErrKey("Ok")).toBe(false);
    });
  });

  describe("isResultOkKey", () => {
    it("returns true for Ok keys", () => {
      expect(isResultOkKey("Ok")).toBe(true);
      expect(isResultOkKey(ResultStatus.OK)).toBe(true);
    });
  });

  describe("isResultKey", () => {
    it("returns true for Err or Ok", () => {
      expect(isResultKey("Err")).toBe(true);
      expect(isResultKey("Ok")).toBe(true);
    });
  });

  describe("resultFormat", () => {
    it("returns ERROR for null/undefined", () => {
      expect(resultFormat(null)).toEqual({
        status: ResultStatus.ERROR,
        message: "",
        data: undefined,
      });
    });

    it("parses Ok result", () => {
      expect(resultFormat({ Ok: { id: 1 } })).toEqual({
        status: ResultStatus.OK,
        data: { id: 1 },
        message: "",
      });
    });

    it("parses Err result", () => {
      const r = resultFormat({ Err: "failed" });
      expect(r.status).toBe(ResultStatus.ERROR);
      expect(r.message).toContain("failed");
    });

    it("returns result as data when not Ok/Err shape", () => {
      expect(resultFormat({ x: 1 })).toEqual({
        status: ResultStatus.OK,
        data: { x: 1 },
        message: "",
      });
    });
  });
});
