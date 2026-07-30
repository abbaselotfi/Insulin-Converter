const fs = require("node:fs");
const path = require("node:path");
const { TextDecoder, TextEncoder } = require("node:util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { JSDOM } = require("jsdom");

function loadApp() {
  const root = path.resolve(__dirname, "..");
  const dom = new JSDOM(fs.readFileSync(path.join(root, "index.html"), "utf8"), {
    runScripts: "outside-only",
    url: "http://localhost/"
  });
  dom.window.scrollTo = jest.fn();
  dom.window.eval(fs.readFileSync(path.join(root, "clinical-engine.js"), "utf8"));
  dom.window.eval(fs.readFileSync(path.join(root, "app.js"), "utf8"));
  return dom;
}

describe("conversion interface", () => {
  test("shows one Soliqua target option and resolves the pen in the result", () => {
    const dom = loadApp();
    const document = dom.window.document;
    const soliquaOptions = [...document.querySelectorAll("#targetInsulin option")]
      .filter((option) => option.value === "soliqua");
    expect(soliquaOptions).toHaveLength(1);
    expect(soliquaOptions[0].textContent).toBe("FRC Soliqua");

    document.querySelector("#sourceInsulin").value = "glargine-u100";
    document.querySelector("#targetInsulin").value = "soliqua";
    document.querySelector("#targetInsulin").dispatchEvent(new dom.window.Event("change"));
    document.querySelector("#currentDose").value = "25";
    document.querySelector("#conversionForm").dispatchEvent(new dom.window.Event("submit", { cancelable: true }));

    expect(document.querySelector("#resultDose").textContent).toBe("20");
    expect(document.querySelector("#penResult").textContent).toContain("100/50");
    expect(document.querySelector("#penResult").classList.contains("pen-peach")).toBe(true);
  });

  test("asks for target premix frequency and exposes two or three injections", () => {
    const dom = loadApp();
    const document = dom.window.document;
    document.querySelector("#targetInsulin").value = "aspart-mix-30";
    document.querySelector("#targetInsulin").dispatchEvent(new dom.window.Event("change"));

    expect(document.querySelector("#targetFrequencyField").hidden).toBe(false);
    expect([...document.querySelectorAll("#targetFrequency option")].map((option) => option.value)).toEqual(["2", "3"]);
  });

  test("replaces insulin dose with weight for a GLP-1 to basal path", () => {
    const dom = loadApp();
    const document = dom.window.document;
    document.querySelector("#sourceInsulin").value = "semaglutide-weekly";
    document.querySelector("#sourceInsulin").dispatchEvent(new dom.window.Event("change"));
    document.querySelector("#targetInsulin").value = "glargine-u100";
    document.querySelector("#targetInsulin").dispatchEvent(new dom.window.Event("change"));

    expect(document.querySelector("#doseField").hidden).toBe(true);
    expect(document.querySelector("#weightField").hidden).toBe(false);
    expect(document.querySelector("#weightKg").required).toBe(true);
  });
});
