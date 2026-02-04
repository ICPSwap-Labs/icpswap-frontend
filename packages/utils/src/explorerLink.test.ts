import { describe, it, expect, vi } from "vitest";
import { explorerLink } from "./explorerLink";

vi.mock("./principal", () => ({
  principalToAccount: vi.fn((addr: string) => `account-${addr}`),
}));

describe("explorerLink", () => {
  it("returns account link for address longer than 27 chars", () => {
    const addr = "a".repeat(28);
    expect(explorerLink(addr)).toContain("/account/");
  });

  it("returns canister link for shorter address", () => {
    expect(explorerLink("abc")).toContain("/canister/");
  });
});
