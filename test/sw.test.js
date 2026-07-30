/**
 * Unit tests for the service worker (sw.js): install-time precaching and the
 * cache-first fetch strategy.
 *
 * sw.js registers `install`/`fetch` listeners on the global `self` at import
 * time, so the tests stub `self.addEventListener` to capture the handlers and
 * provide fake `caches` / `fetch` globals to drive them.
 *
 * @jest-environment jsdom
 */

const path = require("path");

const SW = path.join(__dirname, "..", "sw.js");
const CACHE_NAME = "diabeto-v3";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./clinical-engine.js",
  "./soliqua.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

function loadServiceWorker() {
  const handlers = {};
  const addSpy = jest
    .spyOn(self, "addEventListener")
    .mockImplementation((type, cb) => {
      handlers[type] = cb;
    });
  jest.isolateModules(() => {
    require(SW);
  });
  addSpy.mockRestore();
  return handlers;
}

describe("service worker", () => {
  afterEach(() => {
    delete global.caches;
    delete global.fetch;
  });

  it("registers install and fetch event listeners", () => {
    const handlers = loadServiceWorker();
    expect(typeof handlers.install).toBe("function");
    expect(typeof handlers.fetch).toBe("function");
  });

  it("precaches the core app assets on install", async () => {
    const cache = { addAll: jest.fn() };
    global.caches = { open: jest.fn().mockResolvedValue(cache) };

    const handlers = loadServiceWorker();

    let waited;
    handlers.install({ waitUntil: (p) => (waited = p) });
    await waited;

    expect(global.caches.open).toHaveBeenCalledWith(CACHE_NAME);
    const cachedAssets = cache.addAll.mock.calls[0][0];
    expect(cachedAssets).toEqual(CORE_ASSETS);
  });

  it("serves a cached response when one exists (cache-first)", async () => {
    const cachedResponse = { body: "from-cache" };
    global.caches = { match: jest.fn().mockResolvedValue(cachedResponse) };
    global.fetch = jest.fn();

    const handlers = loadServiceWorker();

    let responded;
    const request = { url: "index.html" };
    handlers.fetch({ request, respondWith: (p) => (responded = p) });
    const result = await responded;

    expect(result).toBe(cachedResponse);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("falls back to the network when the request is not cached", async () => {
    const responseCopy = { body: "cached-network-response" };
    const networkResponse = {
      body: "from-network",
      clone: jest.fn().mockReturnValue(responseCopy),
    };
    const cache = { put: jest.fn().mockResolvedValue(undefined) };
    global.caches = {
      match: jest.fn().mockResolvedValue(undefined),
      open: jest.fn().mockResolvedValue(cache),
    };
    global.fetch = jest.fn().mockResolvedValue(networkResponse);

    const handlers = loadServiceWorker();

    let responded;
    const request = { url: "https://example.com/api" };
    handlers.fetch({ request, respondWith: (p) => (responded = p) });
    const result = await responded;

    expect(global.fetch).toHaveBeenCalledWith(request);
    expect(result).toBe(networkResponse);
    expect(networkResponse.clone).toHaveBeenCalled();
    await Promise.resolve();
    expect(global.caches.open).toHaveBeenCalledWith(CACHE_NAME);
    expect(cache.put).toHaveBeenCalledWith(request, responseCopy);
  });
});
