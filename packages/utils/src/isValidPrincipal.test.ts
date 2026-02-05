import { describe, it, expect, vi } from "vitest";

vi.mock("@dfinity/principal", () => ({
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
    const { Principal } = await import("@dfinity/principal");
    (Principal.fromText as any).mockImplementationOnce(() => {
      throw new Error("invalid");
    });
    expect(isValidPrincipal("bad")).toBe(false);
  });
});
