import { describe, expect, it, vi } from "vitest";

import { icDashboardExplorerLink } from "./explorerLink";

vi.mock("./principal", () => ({
  principalToAccount: vi.fn((addr: string) => `account-${addr}`),
}));

describe("icDashboardExplorerLink", () => {
  it("returns account link for address longer than 27 chars", () => {
    const addr = "a".repeat(28);
    expect(icDashboardExplorerLink(addr)).toContain("/account/");
  });

  it("returns canister link for shorter address", () => {
    expect(icDashboardExplorerLink("abc")).toContain("/canister/");
  });
});
