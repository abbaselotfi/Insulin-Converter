/**
 * Unit tests for the core clinical logic in insulin-logic.js.
 *
 * This logic previously lived as an inline <script> inside index.html and had
 * zero test coverage. It was extracted verbatim (behaviour-preserving) into
 * insulin-logic.js so it can be required and unit tested here. The tests drive
 * the functions exactly the way the UI does: populate the form, run
 * updateRegimen() (which fills the guideline/frequency selects), then call
 * convertInsulin() and assert on the rendered output.
 *
 * @jest-environment jsdom
 */

const fs = require("fs");
const path = require("path");

const {
  getGroupType,
  updateRegimen,
  convertInsulin,
} = require("../insulin-logic.js");

const FORM_HTML = fs.readFileSync(
  path.join(__dirname, "fixtures", "form.html"),
  "utf8"
);

function set(id, value) {
  document.getElementById(id).value = value;
}

/**
 * Rebuilds the real index.html form markup in the jsdom document, selects the
 * source/target insulins and runs updateRegimen() so the dynamically-populated
 * selects (guideline, frequency) exist, just like the live page.
 */
function setupConversion({ from, to }) {
  document.body.innerHTML = FORM_HTML;
  set("insFrom", from);
  set("insTo", to);
  updateRegimen();
}

/** Reads the numeric "<N> واحد" dose out of the rendered result box. */
function resultUnits() {
  // The dose is always rendered in the last <div> of the result box as
  // "<N> واحد" (a preceding div may hold the Soliqua pen name).
  const divs = document.querySelectorAll("#resultText div");
  const text = divs.length
    ? divs[divs.length - 1].textContent
    : document.getElementById("resultText").textContent;
  const match = text.match(/(\d+)\s*واحد/);
  return match ? Number(match[1]) : null;
}

function resultPenLabel() {
  return document.getElementById("resultText").textContent;
}

function descText() {
  // convertInsulin writes the description via .innerText.
  return document.getElementById("descText").innerText || "";
}

describe("getGroupType", () => {
  it.each(["lantus", "toujeo", "tresiba", "levemir", "nph_basal"])(
    "classifies %s as basal",
    (name) => {
      expect(getGroupType(name)).toBe("basal");
    }
  );

  it.each(["novomix", "humalog_mix_25", "humalog_mix_50", "ryzodeg", "human_mix"])(
    "classifies %s as premix",
    (name) => {
      expect(getGroupType(name)).toBe("premix");
    }
  );

  it.each(["soliqua_50", "soliqua_33", "soliqua_combined"])(
    "classifies %s as soliqua",
    (name) => {
      expect(getGroupType(name)).toBe("soliqua");
    }
  );

  it.each(["apidra_novorapid", "regular"])(
    "classifies %s as bolus",
    (name) => {
      expect(getGroupType(name)).toBe("bolus");
    }
  );

  it("falls back to basal for unknown insulins", () => {
    expect(getGroupType("")).toBe("basal");
    expect(getGroupType("something_else")).toBe("basal");
  });
});

describe("convertInsulin - input validation", () => {
  let alertSpy;

  beforeEach(() => {
    document.body.innerHTML = FORM_HTML;
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it.each(["", "0", "-5", "abc"])(
    "alerts and does not render a result for invalid dose %p",
    (value) => {
      set("insFrom", "lantus");
      set("insTo", "levemir");
      set("currentDose", value);

      convertInsulin();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(document.getElementById("resultBox").style.display).not.toBe(
        "block"
      );
    }
  );
});

describe("convertInsulin - bolus conversions (1:1)", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("converts fast-acting analogues unit-for-unit and rounds", () => {
    setupConversion({ from: "apidra_novorapid", to: "regular" });
    set("currentDose", "13.4");

    convertInsulin();

    expect(resultUnits()).toBe(13);
    expect(descText()).toContain("بولوس");
    expect(document.getElementById("resultBox").style.display).toBe("block");
    expect(document.getElementById("alertBox").style.display).toBe("block");
  });
});

describe("convertInsulin - basal to basal", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  // A twice-daily (BID) source is used here: it is the branch of the code that
  // executes the guideline logic without hitting the once-daily crash captured
  // in the "known defects" suite below. A BID source forces the conservative
  // 20% reduction (multiplier capped at 0.8), so 30 units -> 24.
  function runBidSource({ guideline, from = "levemir", to = "lantus", dose = "30" }) {
    setupConversion({ from, to });
    set("currentDose", dose);
    set("guideline", guideline);
    set("strategy", "1.0");
    set("freqFrom", "2"); // BID source
    set("freqTo", "1"); // QD target
    convertInsulin();
  }

  it("ADA: reduces a BID basal source by 20% when consolidating to QD", () => {
    runBidSource({ guideline: "ada" });
    expect(resultUnits()).toBe(24);
    expect(descText()).toContain("ADA");
    expect(descText()).toContain("BID به QD");
  });

  it("AACE: applies its conservative reduction for cross-brand switches", () => {
    runBidSource({ guideline: "aace" });
    expect(resultUnits()).toBe(24);
    expect(descText()).toContain("AACE");
  });

  it("Diabetes Canada: renders its guideline-specific rationale", () => {
    runBidSource({ guideline: "canadian" });
    expect(resultUnits()).toBe(24);
    expect(descText()).toContain("Diabetes Canada");
  });

  it("NICE: renders its guideline-specific rationale", () => {
    runBidSource({ guideline: "nice" });
    expect(resultUnits()).toBe(24);
    expect(descText()).toContain("NICE");
  });
});

describe("convertInsulin - switch to Soliqua (fixed-ratio combination)", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("selects Soliqua 100/33 capped at 30 units when basal dose >= 30", () => {
    setupConversion({ from: "lantus", to: "soliqua_combined" });
    set("currentDose", "45");
    convertInsulin();
    expect(resultUnits()).toBe(30);
    expect(resultPenLabel()).toContain("Insulin FRC Soliqua 100/33");
  });

  it("selects Soliqua 100/50 capped at 20 units for basal dose 20-29", () => {
    setupConversion({ from: "lantus", to: "soliqua_combined" });
    set("currentDose", "25");
    convertInsulin();
    expect(resultUnits()).toBe(20);
    expect(resultPenLabel()).toContain("Insulin FRC Soliqua 100/50");
  });

  it("selects Soliqua 100/50 starting at 10 units for low basal dose < 20", () => {
    setupConversion({ from: "lantus", to: "soliqua_combined" });
    set("currentDose", "12");
    convertInsulin();
    expect(resultUnits()).toBe(10);
  });

  it("applies the mandatory 20% reduction when switching from Toujeo", () => {
    // 40 * 0.8 = 32 -> still >= 30 -> Soliqua 100/33 capped at 30 units.
    setupConversion({ from: "toujeo", to: "soliqua_combined" });
    set("currentDose", "40");
    convertInsulin();
    expect(resultUnits()).toBe(30);
    expect(descText()).toContain("توژئو");
  });
});

/**
 * Characterization tests: these capture *current, incorrect* behaviour of
 * convertInsulin() that the test suite surfaced. They are here to prevent the
 * behaviour from changing silently and to document the bugs for a follow-up
 * fix. See the PR description for details. If/when the underlying bug is fixed,
 * the corresponding test should be updated to assert the correct behaviour.
 */
describe("convertInsulin - KNOWN DEFECTS (characterization)", () => {
  beforeEach(() => {
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("BUG: a once-daily basal->basal conversion throws (initialMultiplier shadowing)", () => {
    // The most common clinical case (e.g. Lantus QD -> Levemir QD) currently
    // crashes: inside the final `else` branch a `let l = ""` shadows the
    // freq-to flag, so `l ? ... initialMultiplier ...` dereferences an
    // undeclared variable.
    setupConversion({ from: "lantus", to: "levemir" });
    set("currentDose", "20");
    set("guideline", "ada");
    set("strategy", "1.0");
    set("freqFrom", "1");
    set("freqTo", "1");

    expect(() => convertInsulin()).toThrow(
      /initialMultiplier is not defined/
    );
  });

  it("BUG: premix-source basal extraction collapses the dose to ~0 (uses e*e)", () => {
    // When converting FROM a premix, the basal fraction is computed as
    // `y = ratio * ratio` (0.7 * 0.7 = 0.49) instead of `ratio * dose`, so the
    // resulting dose is rounded to 0 regardless of the entered dose.
    setupConversion({ from: "novomix", to: "lantus" });
    set("currentDose", "40");
    set("guideline", "ada");
    set("strategy", "1.0");
    set("freqFrom", "2"); // BID source avoids the once-daily crash above
    set("freqTo", "1");

    convertInsulin();

    expect(resultUnits()).toBe(0);
  });
});
