import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFromText = vi.fn();
const mockToHex = vi.fn();
const mockFromPrincipal = vi.fn();

vi.mock("@dfinity/principal", () => ({
  Principal: {
    fromText: mockFromText,
  },
}));

vi.mock("@dfinity/ledger-icp", () => ({
  AccountIdentifier: {
    fromPrincipal: vi.fn().mockReturnValue({ toHex: mockToHex }),
  },
  SubAccount: {
    fromPrincipal: mockFromPrincipal,
  },
}));

vi.mock("./ic", () => ({
  isSubAccount: vi.fn((s: any) => s && typeof s.toUint8Array === "function"),
}));

vi.mock("./isValidPrincipal", () => ({
  isValidPrincipal: vi.fn((s: string) => s === "valid-principal"),
}));

describe("principal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFromText.mockReturnValue({});
    mockToHex.mockReturnValue("hex-account");
    mockFromPrincipal.mockReturnValue({ toUint8Array: () => new Uint8Array(32) });
  });

  it("exports principalToAccount and principalToSubaccount", async () => {
    const { principalToAccount, principalToSubaccount } = await import("./principal");
    expect(typeof principalToAccount).toBe("function");
    expect(typeof principalToSubaccount).toBe("function");
  });

  it("principalToAccount returns principal when no subAccount", async () => {
    const { principalToAccount } = await import("./principal");
    const result = principalToAccount("abc");
    expect(mockToHex).toHaveBeenCalled();
    expect(result).toBe("hex-account");
  });
});
