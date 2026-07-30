/**
 * Unit tests for pwa-handler.js (the install-banner / PWA prompt logic).
 *
 * The module runs its side effects at import time (injecting the banner and
 * wiring up listeners), so each test resets the module registry and rebuilds
 * a clean document / localStorage / userAgent before requiring it.
 *
 * @jest-environment jsdom
 */

const path = require("path");

const HANDLER = path.join(__dirname, "..", "pwa-handler.js");
const DISMISS_KEY = "pwa_banner_dismissed_time";

function setUserAgent(ua) {
  Object.defineProperty(window.navigator, "userAgent", {
    value: ua,
    configurable: true,
  });
}

function loadHandler() {
  jest.isolateModules(() => {
    require(HANDLER);
  });
}

describe("pwa-handler", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    window.localStorage.clear();
    setUserAgent("Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0");
  });

  it("injects the install banner markup and styles into the page", () => {
    loadHandler();

    expect(document.getElementById("pwa-install-banner")).not.toBeNull();
    expect(document.getElementById("pwa-btn-action")).not.toBeNull();
    expect(document.getElementById("pwa-btn-dismiss")).not.toBeNull();
    expect(document.head.querySelector("style")).not.toBeNull();
  });

  it("shows the banner on beforeinstallprompt when not previously dismissed", () => {
    loadHandler();

    const evt = new window.Event("beforeinstallprompt");
    evt.preventDefault = jest.fn();
    window.dispatchEvent(evt);

    expect(evt.preventDefault).toHaveBeenCalled();
    expect(document.getElementById("pwa-install-banner").style.display).toBe(
      "flex"
    );
  });

  it("stays hidden on beforeinstallprompt if dismissed within the last 7 days", () => {
    window.localStorage.setItem(DISMISS_KEY, Date.now().toString());
    loadHandler();

    window.dispatchEvent(new window.Event("beforeinstallprompt"));

    expect(document.getElementById("pwa-install-banner").style.display).not.toBe(
      "flex"
    );
  });

  it("shows the banner again on beforeinstallprompt once the 7-day window elapsed", () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    window.localStorage.setItem(DISMISS_KEY, eightDaysAgo.toString());
    loadHandler();

    window.dispatchEvent(new window.Event("beforeinstallprompt"));

    expect(document.getElementById("pwa-install-banner").style.display).toBe(
      "flex"
    );
  });

  it("dismiss button hides the banner and records the dismissal time", () => {
    loadHandler();
    const banner = document.getElementById("pwa-install-banner");
    banner.style.display = "flex";

    document.getElementById("pwa-btn-dismiss").click();

    expect(banner.style.display).toBe("none");
    expect(window.localStorage.getItem(DISMISS_KEY)).not.toBeNull();
  });

  it("shows iOS-specific 'Add to Home Screen' guidance on iPhone Safari", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) Safari"
    );
    loadHandler();

    const banner = document.getElementById("pwa-install-banner");
    expect(banner.style.display).toBe("flex");
    expect(document.getElementById("pwa-title-text").innerText).toContain(
      "اضافه کردن به صفحه اصلی"
    );
    // The direct install button is useless on iOS and must be hidden.
    expect(document.getElementById("pwa-btn-action").style.display).toBe("none");
  });
});
