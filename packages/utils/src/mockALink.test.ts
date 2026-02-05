import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockALinkAndOpen } from "./mockALink";

describe("mockALinkAndOpen", () => {
  const appendChild = vi.fn();
  const click = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("document", {
      createElement: vi.fn(() => ({
        setAttribute: vi.fn(),
        click,
      })),
      getElementById: vi.fn(() => null),
      body: { appendChild },
    });
  });

  it("creates link and calls click", () => {
    mockALinkAndOpen("https://example.com", "test-id");
    expect(appendChild).toHaveBeenCalled();
    expect(click).toHaveBeenCalled();
  });
});
