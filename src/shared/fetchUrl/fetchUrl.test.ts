import fetchUrl from "./fetchUrl";

declare global {
  namespace NodeJS {
    interface Global {
      fetch: any;
    }
  }
}

describe("Testing FetchUrl - Wrapper over fetch", () => {
  const res = [
    {
      id: "1",
      name: "Abc",
    },
  ];

  it("should perform basic fetch functions", () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(res),
    });

    fetchUrl("/api/v1/someUrl");
    expect(window.fetch).toHaveBeenCalledWith("/api/v1/someUrl", {});
    expect(window.fetch).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
  });
  it("should resolve with data for valid request", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(res),
    });

    const fetchResponse = await fetchUrl("/api/v1/someUrl");
    expect(fetchResponse).toBe(res);

    jest.restoreAllMocks();
  });
  it(`should reject with data for fetch status returns ok false`, async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(res),
    });
    try {
      await fetchUrl("/api/v1/someUrl");
    } catch (e) {
      expect(e).toBe(res);
    }

    jest.restoreAllMocks();
  });
});
