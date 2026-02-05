import { describe, it, expect, vi, beforeEach } from "vitest";

const MockSubAccount = vi.fn();

vi.mock("@dfinity/ledger-icp", () => ({
  SubAccount: class SubAccount {
    static _isSubAccount = true;
    constructor(...args: any[]) {
      MockSubAccount(...args);
    }
  },
}));

describe("ic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("isSubAccount returns true for SubAccount instance", async () => {
    const { isSubAccount } = await import("./ic");
    const { SubAccount } = await import("@dfinity/ledger-icp");
    const sub = new (SubAccount as any)();
    expect(isSubAccount(sub)).toBe(true);
  });

  it("isSubAccount returns false for plain object", async () => {
    const { isSubAccount } = await import("./ic");
    expect(isSubAccount({})).toBe(false);
  });

  it("isOkSubAccount returns false for Error", async () => {
    const { isOkSubAccount } = await import("./ic");
    expect(isOkSubAccount(new Error())).toBe(false);
  });
});
