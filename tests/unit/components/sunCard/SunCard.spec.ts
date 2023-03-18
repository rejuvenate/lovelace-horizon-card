import { HomeAssistant } from "custom-card-helpers";
import { css, CSSResult } from "lit";

import { SunCard } from "../../../../src/components/sunCard/SunCard";
import { SunCardEditor } from "../../../../src/components/sunCardEditor";
import { Constants } from "../../../../src/constants";
import { ESunCardErrors, ISunCardConfig, TSunCardData } from "../../../../src/types";
import { CustomSnapshotSerializer, TemplateResultTestHelper } from "../../../helpers/TestHelpers";

jest.mock("../../../../src/components/SunErrorContent", () => require("../../../mocks/SunErrorContent"));
jest.mock("../../../../src/components/sunCard/SunCardContent", () => require("../../../mocks/SunCardContent"));
jest.mock("../../../../src/utils/HelperFunctions", () => require("../../../mocks/HelperFunctions"));
jest.mock("../../../../src/utils/I18N", () => require("../../../mocks/I18N"));
jest.mock("../../../../src/cardStyles", () => css``);

expect.addSnapshotSerializer(new CustomSnapshotSerializer());

// JSDom doesn't include SVGPathElement
class SVGPathElement {
  getPointAtLength() {
    return {
      x: 0,
      y: 0
    };
  }
}

Object.defineProperty(window, "SVGPathElement", { value: SVGPathElement });

describe("SunCard", () => {
  let sunCard: SunCard;

  beforeEach(() => {
    sunCard = new SunCard();
    sunCard.attachShadow({ mode: "open" });
  });

  describe("set hass", () => {
    it("updates lastHass property", () => {
      jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      expect(sunCard["lastHass"]).toBeUndefined();

      const expectedLastHass = {} as HomeAssistant;
      sunCard.hass = expectedLastHass;
      expect(sunCard["lastHass"]).toEqual(expectedLastHass);
    });

    it("calls populateConfigFromHass if it has not been rendered yet", () => {
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = false;

      sunCard.hass = {} as HomeAssistant;
      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1);
    });

    it("does not call populateConfigFromHass if it has been rendered", () => {
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = true;

      sunCard.hass = {} as HomeAssistant;
      expect(populateConfigFromHassSpy).not.toHaveBeenCalled();
    });

    it("calls processLastHass if it has been rendered", () => {
      jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      const processLastHassSpy = jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = true;

      sunCard.hass = {} as HomeAssistant;
      expect(processLastHassSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("getConfigElement", () => {
    it("creates and return a sun card config element", () => {
      const expectedElement = document.createElement("div");
      const createElementSpy = jest.spyOn(document, "createElement").mockReturnValueOnce(expectedElement);
      const result = SunCard.getConfigElement();

      expect(result).toEqual(expectedElement);
      expect(createElementSpy).toHaveBeenCalledTimes(1);
      expect(createElementSpy).toHaveBeenCalledWith(SunCardEditor.cardType);
    });
  });

  describe("setConfig", () => {
    it("overrides old config with new values", () => {
      jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      expect(sunCard["config"]).toEqual({ type: SunCard.cardType });
      const config = {
        type: SunCard.cardType,
        title: "Test"
      } as ISunCardConfig;

      sunCard.setConfig(config);
      expect(sunCard["config"].title).toEqual(config.title);

      const newConfig = {
        type: SunCard.cardType,
        title: "Test2"
      } as ISunCardConfig;

      sunCard.setConfig(newConfig);
      expect(sunCard["config"].title).toEqual(newConfig.title);
    });

    it("uses the provided component", () => {
      const config = {
        type: SunCard.cardType,
        component: "test"
      } as ISunCardConfig;

      sunCard.setConfig(config);
      expect(sunCard["config"].component).toEqual(config.component);
    });

    it("uses the default component when not provided", () => {
      const config = {
        type: SunCard.cardType
      } as ISunCardConfig;

      sunCard.setConfig(config);
      expect(sunCard["config"].component).toEqual(Constants.DEFAULT_CONFIG.component);
    });

    it("throws an error if the provided language is not supported", () => {
      const config = {
        type: SunCard.cardType,
        language: "notSupportedLanguage"
      } as ISunCardConfig;

      let thrownError;
      try {
        sunCard.setConfig(config);
      } catch (error) {
        thrownError = (error as Error).message;
      }

      expect(thrownError).toEqual(`${config.language} is not a supported language. Supported languages: ${Object.keys(Constants.LOCALIZATION_LANGUAGES)}`);
    });

    const fields = ["sunrise", "sunset", "dawn", "noon", "dusk", "azimuth", "elevation"];
    for (const field of fields) {
      it(`uses the provided value for ${field}`, () => {
        const config = {
          type: SunCard.cardType,
          fields: {
            [field]: "test"
          }
        } as ISunCardConfig;

        sunCard.setConfig(config);
        expect(sunCard["config"].fields?.[field]).toEqual("test");
      });

      it(`uses the default value for ${field} when not provided`, () => {
        const config = {
          type: SunCard.cardType
        } as ISunCardConfig;

        sunCard.setConfig(config);
        expect(sunCard["config"].fields?.[field]).toEqual(Constants.DEFAULT_CONFIG.fields?.[field]);
      });
    }

    it("calls populateConfigFromHass if lastHass has a value", () => {
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      sunCard["lastHass"] = {} as HomeAssistant;

      const config = {
        type: SunCard.cardType
      } as ISunCardConfig;

      sunCard.setConfig(config);
      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1);
    });

    it("does not call populateConfigFromHass if lastHass has not a value", () => {
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      delete (sunCard as any)["lastHass"];

      const config = {
        type: SunCard.cardType
      } as ISunCardConfig;

      sunCard.setConfig(config);
      expect(populateConfigFromHassSpy).not.toHaveBeenCalled();
    });
  });

  describe("render", () => {
    it("renders an error if error is present on data", async () => {
      if (!sunCard["data"]) {
        sunCard["data"] = {} as TSunCardData;
      }

      sunCard["data"].error = ESunCardErrors.SunIntegrationNotFound;
      const element = window.document.createElement("test-element") as TemplateResultTestHelper<typeof sunCard.render>;
      element.templateResultFunction = () => sunCard.render();
      window.document.body.appendChild(element);
      await element.updateComplete;

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
    });

    it("renders the sun card if no error is present on data", async () => {
      const element = window.document.createElement("test-element") as TemplateResultTestHelper<typeof sunCard.render>;
      element.templateResultFunction = () => sunCard.render();
      window.document.body.appendChild(element);
      await element.updateComplete;

      expect(element.shadowRoot!.innerHTML).toMatchSnapshot();
    });
  });

  describe("updated", () => {
    it("sets to true hasRendered if has not been rendered yet", () => {
      jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = false;
      sunCard["updated"](new Map());
      expect(sunCard["hasRendered"]).toEqual(true);
    });

    it("calls processLastHass if has not been rendered yet", () => {
      const processLastHassSpy = jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = false;
      sunCard["updated"](new Map());
      expect(processLastHassSpy).toHaveBeenCalledTimes(1);
    });

    it("does nothing more than call super.updated if has been already rendered", () => {
      const processLastHassSpy = jest.spyOn(sunCard as any, "processLastHass").mockReturnValue(undefined);
      sunCard["hasRendered"] = true;
      sunCard["updated"](new Map());
      expect(processLastHassSpy).not.toHaveBeenCalledWith();
    });
  });

  describe("populateConfigFromHass", () => {
    it("keeps values from config when present", () => {
      const config = {
        type: SunCard.cardType,
        darkMode: true,
        language: "es"
      } as ISunCardConfig;

      sunCard["lastHass"] = {
        themes: {
          darkMode: false
        },
        locale: {
          language: "en"
        }
      } as any;

      sunCard["config"] = config;
      sunCard["populateConfigFromHass"]();
      expect(sunCard["config"].darkMode).toEqual(config.darkMode);
      expect(sunCard["config"].language).toEqual(config.language);
    });

    it("sets values from hass when not present in config", () => {
      sunCard["lastHass"] = {
        themes: {
          darkMode: false
        },
        locale: {
          language: "it"
        }
      } as any;

      sunCard["populateConfigFromHass"]();
      expect(sunCard["config"].darkMode).toEqual(false);
      expect(sunCard["config"].language).toEqual("it");
    });

    it("supports old versions of home assistant", () => {
      sunCard["lastHass"] = {
        themes: {
          darkMode: false
        },
        language: "it"
      } as any;

      sunCard["populateConfigFromHass"]();
      expect(sunCard["config"].darkMode).toEqual(false);
      expect(sunCard["config"].language).toEqual("it");
    });
  });

  describe("processLastHass", () => {
    it("does an early return if lastHass has no value", () => {
      delete (sunCard as any)["lastHass"];
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      sunCard["processLastHass"]();

      expect(populateConfigFromHassSpy).not.toHaveBeenCalled();
    });

    it("calls populateConfigFromHass", () => {
      (sunCard as any)["lastHass"] = { states: {} };
      const populateConfigFromHassSpy = jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      sunCard["processLastHass"]();

      expect(populateConfigFromHassSpy).toHaveBeenCalledTimes(1);
    });

    it("process the data from the component when found", () => {
      (sunCard as any)["lastHass"] = {
        states: {
          component: {
            attributes: {
              azimuth: 3,
              elevation: 7
            }
          }
        }
      };

      const config = {
        type: SunCard.cardType,
        component: "component"
      } as ISunCardConfig;

      sunCard["config"] = config;

      jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);

      const times = {
        dawn: new Date(0),
        dusk: new Date(0),
        noon: new Date(0),
        sunrise: new Date(0),
        sunset: new Date(0)
      };

      const sunInfo = {
        sunrise: 0,
        sunset: 0,
        dawnProgressPercent: 0,
        dayProgressPercent: 0,
        duskProgressPercent: 0,
        sunAboveHorizon: 0,
        sunPercentOverHorizon: 0,
        sunPosition: { x: 0, y: 0 }
      };

      const readTimesSpy = jest.spyOn(sunCard as any, "readTimes").mockReturnValue(times);
      const calculateSunInfoSpy = jest.spyOn(sunCard as any, "calculateSunInfo").mockReturnValue(sunInfo);

      sunCard["processLastHass"]();

      expect(readTimesSpy).toHaveBeenCalledTimes(1);
      expect(calculateSunInfoSpy).toHaveBeenCalledTimes(1);
      expect(sunCard["data"].times).toEqual(times);
      expect(sunCard["data"].sunInfo).toEqual(sunInfo);
    });

    it("sets an error if the component is not found", () => {
      (sunCard as any)["lastHass"] = { states: {} };
      jest.spyOn(sunCard as any, "populateConfigFromHass").mockReturnValue(undefined);
      sunCard["processLastHass"]();

      expect(sunCard["data"].error).toEqual(ESunCardErrors.SunIntegrationNotFound);
    });
  });

  describe("readTimes", () => {
    it("returns dates for each time field", () => {
      const readTimeSpy = jest.spyOn(sunCard as any, "readTime").mockReturnValue(new Date(0));
      const result = sunCard["readTimes"]({
        next_setting: 0,
        next_dawn: 0,
        next_dusk: 0,
        next_noon: 0,
        next_rising: 0
      });

      expect(result).toEqual({
        dawn: new Date(0),
        dusk: new Date(0),
        noon: new Date(0),
        sunrise: new Date(0),
        sunset: new Date(0)
      });

      expect(readTimeSpy).toHaveBeenCalledTimes(4);
    });
  });

  describe("readTime", () => {
    it("sets a specific day, month and year to a provided string date", () => {
      // Prepare
      const attributeToParse = "2023-03-18T00:00:00.000Z";
      const year = 2023;
      const month = 1;
      const date = 1;

      // Act
      const result = sunCard["readTime"](attributeToParse, year, month, date);

      // Assert
      expect(result).toBeInstanceOf(Date);
      expect(result.getUTCFullYear()).toEqual(year);
      expect(result.getUTCMonth()).toEqual(month);
      expect(result.getUTCDate()).toEqual(date);
    });
  });

  describe("calculateSunInfo", () => {
    it("returns all sun info", () => {
      const path = new SVGPathElement();
      jest.spyOn((sunCard as any).shadowRoot, "querySelector").mockReturnValue(path);

      const result = sunCard["calculateSunInfo"](new Date(0), new Date(0));
      expect(result).toEqual({
        dawnProgressPercent: 0,
        dayProgressPercent: 0,
        duskProgressPercent: 0,
        sunAboveHorizon: true,
        sunPercentOverHorizon: 0,
        sunPosition: {
          x: 0,
          y: 0
        },
        sunrise: 0,
        sunset: 0
      });
    });
  });

  describe("get styles", () => {
    it("returns a CSSResult", () => {
      expect(SunCard.styles).toBeInstanceOf(CSSResult);
    });
  });
});
