import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetch_post, fetch_get } from "./fetch_post";

describe("fetch_post", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns undefined when fetch fails", async () => {
    (globalThis.fetch as any).mockRejectedValueOnce(new Error("network"));
    const result = await fetch_post("https://example.com/api", {});
    expect(result).toBeUndefined();
  });

  it("returns StatusResult when fetch succeeds", async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 200, data: { id: 1 } }),
    });
    const result = await fetch_post<{ id: number }>("https://example.com/api");
    expect(result?.status).toBe("ok");
    expect(result?.data).toEqual({ id: 1 });
  });
});

describe("fetch_get", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns undefined when fetch fails", async () => {
    (globalThis.fetch as any).mockRejectedValueOnce(new Error("network"));
    const result = await fetch_get("https://example.com/api");
    expect(result).toBeUndefined();
  });
});
