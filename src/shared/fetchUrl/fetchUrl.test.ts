import fetchUrl from "./fetchUrl";
import sinon from "sinon";

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
    const mockFetch = sinon.fake.resolves({
      ok: true,
      json: () => res,
    });
    // Inject mock fetch into global
    global.fetch = mockFetch;
    fetchUrl("/api/v1/someUrl");
    expect(mockFetch.calledWith("/api/v1/someUrl")).toBeTruthy();
    expect(mockFetch.calledOnce).toBeTruthy();
    delete global.fetch;
  });
  it("should resolve with data for valid request", async () => {
    const mockFetch = sinon.fake.resolves({
      ok: true,
      json: () => res,
    });
    // Inject mock fetch into global
    global.fetch = mockFetch;
    const fetchResponse = await fetchUrl("/api/v1/someUrl");
    expect(fetchResponse).toBe(res);
    delete global.fetch;
  });
  it(`should reject with data for fetch status returns ok false`, async () => {
    const mockFetch = sinon.fake.resolves({
      ok: false,
      json: () => res,
    });
    // Inject mock fetch into global
    global.fetch = mockFetch;
    try {
      await fetchUrl("/api/v1/someUrl");
    } catch (e) {
      expect(e).toBe(res);
    }
    delete global.fetch;
  });
});
