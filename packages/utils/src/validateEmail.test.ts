import { describe, it, expect } from "vitest";
import { validateEmail } from "./validateEmail";

describe("validateEmail", () => {
  it("returns match for valid email", () => {
    expect(validateEmail("user@example.com")).toBeTruthy();
    expect(validateEmail("test.user@domain.co")).toBeTruthy();
  });

  it("returns null for invalid email", () => {
    expect(validateEmail("invalid")).toBeNull();
    expect(validateEmail("@nodomain.com")).toBeNull();
  });
});
