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
    expect(document.querySelector("#targetInsulin").value).toBe("soliqua");

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

  test("uses the ICon brand and removes GLP-1 and weight controls", () => {
    const dom = loadApp();
    const document = dom.window.document;
    expect(document.title).toContain("ICon");
    expect(document.querySelector(".brand strong").textContent).toBe("ICon");
    expect(document.querySelector("#weightField")).toBeNull();
    expect(document.body.textContent).not.toContain("GLP-1 / GIP");
    expect([...document.querySelectorAll("#sourceInsulin option")].some((option) => option.value.includes("semaglutide"))).toBe(false);
  });

  test("filters prandial targets in both directions", () => {
    const dom = loadApp();
    const document = dom.window.document;

    document.querySelector("#sourceInsulin").value = "aspart-u100";
    document.querySelector("#sourceInsulin").dispatchEvent(new dom.window.Event("change"));
    let targets = [...document.querySelectorAll("#targetInsulin option")].map((option) => option.value);
    expect(targets).toEqual(expect.arrayContaining(["lispro-u100", "glulisine-u100", "regular-u100"]));
    expect(targets.some((value) => value.includes("glargine") || value.includes("mix") || value === "soliqua")).toBe(false);

    document.querySelector("#sourceInsulin").value = "glargine-u100";
    document.querySelector("#sourceInsulin").dispatchEvent(new dom.window.Event("change"));
    targets = [...document.querySelectorAll("#targetInsulin option")].map((option) => option.value);
    expect(targets.some((value) => ["aspart-u100", "lispro-u100", "glulisine-u100", "regular-u100"].includes(value))).toBe(false);
    expect(document.querySelector("#targetInsulin").value).toBe("soliqua");

    document.querySelector("#sourceInsulin").value = "aspart-mix-30";
    document.querySelector("#sourceInsulin").dispatchEvent(new dom.window.Event("change"));
    targets = [...document.querySelectorAll("#targetInsulin option")].map((option) => option.value);
    expect(targets).toContain("soliqua");
    expect(document.querySelector("#targetInsulin").value).toBe("soliqua");
    expect(targets.some((value) => ["aspart-u100", "lispro-u100", "glulisine-u100", "regular-u100"].includes(value))).toBe(false);
  });

  test("keeps the English start button readable and mirrors only directional arrows", () => {
    const dom = loadApp();
    const document = dom.window.document;

    document.querySelector("#languageToggle").click();

    const startLabel = document.querySelector("[data-i18n='startConversion']");
    expect(startLabel.textContent).toBe("Start insulin conversion");
    expect(startLabel.classList.contains("direction-arrow")).toBe(false);
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.querySelectorAll(".direction-arrow")).toHaveLength(2);
  });
});
