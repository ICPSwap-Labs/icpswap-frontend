import { describe, expect, it, vi } from "vitest";

vi.mock("@icpswap/dfinity", () => ({
  Principal: {
    fromText: vi.fn((text: string) => ({
      toText: () => text,
    })),
  },
}));

describe("isValidPrincipal", () => {
  it("returns true for valid principal", async () => {
    const { isValidPrincipal } = await import("./isValidPrincipal");
    expect(isValidPrincipal("aaaaa-aa")).toBe(true);
  });

  it("returns false for invalid principal", async () => {
    const { isValidPrincipal } = await import("./isValidPrincipal");
    const { Principal } = await import("@icpswap/dfinity");
    (Principal.fromText as any).mockImplementationOnce(() => {
      throw new Error("invalid");
    });
    expect(isValidPrincipal("bad")).toBe(false);
  });
});
