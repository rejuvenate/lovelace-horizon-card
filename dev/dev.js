const settings = {
  // Dates in dev panel
  dates: [
    "2023-01-19",
    "2023-03-17",
    "2023-05-18",
    "2023-06-21",
    "2023-08-08",
    "2023-09-21",
    "2023-11-01",
    "2023-11-10",
    "2023-12-22",
  ],

  // Places in dev panel
  places: [
    {city: "Sofia", country: "BG", tz: "Europe/Sofia", tzOffset: "+02:00", lat: 42.7, lon: 23.3},
    {city: "Berlin", country: "DE", tz: "Europe/Berlin", tzOffset: "+01:00", lat: 52.5, lon: 13.4},
    {city: "Karasjok", country: "NO", tz: "Europe/Oslo", tzOffset: "+01:00", lat: 69.5, lon: 25.5},
    {city: "Quito", country: "EC", tz: "America/Lima", tzOffset: "-05:00", lat: -0.15, lon: -78.5},
    {city: "Sao Paulo", country: "BR", tz: "America/Sao_Paulo", tzOffset: "-03:00", lat: -23.5, lon: -46.6},
    {city: "Melbourne", country: "AU", tz: "Australia/Melbourne", tzOffset: "+10:00", lat: -37.8, lon: 144.9},
    //{city: "Cape Town", country: "SA", tz: "Africa/Johannesburg", tzOffset: "+02:00", lat: -34, lon: 18.5}
  ],

  // Card config
  config: {
    title: "Sunrise & Sunset",
    moon: true,
    fields: {
      // sunrise: false,
      // sunset: false,
      // dawn: false,
      // dusk: false,
      // noon: false,
      azimuth: true,
      elevation: true,
      moonrise: true,
      moonset: true,
      moon_phase: true
    },
    time_format: "24",
    number_format: "language",
    refresh_period: 0,
    debug_level: 0
  },

  darkMode: true,
  intervalUpdateMs: 200,
  stepMinutes: 0,
  date: null,
  place: null,
  lang: "en",
  fixedOffsetInitial: 12 * 60 * 60 * 1000, // 06:00:00
  fixedOffset: 0,
};

init();

function init() {
  defineHaIcon();

  const test = document.querySelector("#test");
  settings.date = settings.dates[0];
  settings.place = settings.places[0];
  settings.fixedOffset = settings.fixedOffsetInitial;

  const dateLabel = document.createElement("div");
  dateLabel.appendChild(document.createTextNode("Date "));
  createButton(dateLabel, "Reset", () => {
    settings.fixedOffset = settings.fixedOffsetInitial;
    update();
  });
  createRadioButtons(dateLabel, "date", settings.dates, settings.date,
    (date) => {
      settings.date = date;
      update();
  });

  createRadioButtons("Place", "place", settings.places, settings.place,
    (place) => {
      settings.place = place;
      update();
    },
    (value) => `${value.city} ${value.country} (${value.lat} ${value.lon})`);

  const stepContainer = createRadioButtons("Step (minutes)", "step", [20, 10, 5, 1440, 0],
    settings.stepMinutes, (min) => {
      settings.stepMinutes = min;
      update();
    },
    (value, index) => [20, 10, 5, "1 day", "Manual"][index]);
  const stepButtons = document.createElement("div");
  stepContainer.appendChild(stepButtons);
  createButton(stepButtons, "+1m", () => {
    settings.fixedOffset += 60 * 1000;
    update();
  });
  createButton(stepButtons, "-1m", () => {
    settings.fixedOffset -= 60 * 1000;
    update();
  });
  createButton(stepButtons, "+1h", () => {
    settings.fixedOffset += 60 * 60 * 1000;
    update();
  });
  createButton(stepButtons, "-1h", () => {
    settings.fixedOffset -= 60 * 60 * 1000;
    update();
  });
  createButton(stepButtons, "+1d", () => {
    settings.fixedOffset += 24 * 60 * 60 * 1000;
    update();
  });
  createButton(stepButtons, "-1d", () => {
    settings.fixedOffset -= 24 * 60 * 60 * 1000;
    update();
  });

  createRadioButtons("Interval (ms)", "interval", [500, 200, 100],
    settings.intervalUpdateMs,
    (ms) => {
      settings.intervalUpdateMs = ms;
      resetInterval();
    });

  createRadioButtons("Theme", "theme", [false, true], settings.darkMode,
    (theme) => {
      settings.darkMode = theme;
      update();
    },
    (value, index) => ["Light", "Dark"][index]);

  createRadioButtons("Clock", "clock", ["24", "12", "language"],
    settings.config.time_format,
    (clock) => {
        settings.config.time_format = clock;
      update();
    },
    (value, index) => ["24-hour", "12-hour", "Language"][index]);

  createLanguageButtons((lang) => {
    settings.lang = lang;
    update();
  });

  let interval = null;

  update();

  resetInterval();

  function update() {
    if (settings.darkMode) {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }

    const midnightInTz = window.HelperFunctions.midnightAtTimeZone(new Date(settings.date), settings.place.tz);
    const nowInTz = new Date(midnightInTz.getTime() + settings.fixedOffset);
    document.querySelector("#time").innerText = formatDT(nowInTz, settings.place.tz);

    settings.config.now = nowInTz;
    test.setConfig({ ...settings.config });
    test.hass = {
      language: settings.lang,
      locale: {
        language: settings.lang
      },
      themes: {
        darkMode: settings.darkMode
      },
      config: {
        latitude: settings.place.lat,
        longitude: settings.place.lon,
        time_zone: settings.place.tz
      },
      localize: localizeMock
    };
  }

  function resetInterval() {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(function() {
      settings.fixedOffset += settings.stepMinutes * 60 * 1000;
      if (settings.stepMinutes > 0) {
        update();
      }
    }, settings.intervalUpdateMs);
  }

  function formatDT(date, timeZone) {
    return new Intl.DateTimeFormat("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "shortOffset",
      timeZone
    }).format(date);
  }
}

function createRadioButtons(desc, id, values, defaultValue, callback, labelMapper) {
  const buttons = document.querySelector("#buttons");
  const container = document.createElement("div");
  container.id = id;
  if (values.length > 6) {
    // I couldn't figure how to make the div grow on its own when the items wrap :(
    container.style.minWidth = "250px";
  }
  buttons.appendChild(container);

  if (desc instanceof HTMLElement) {
    container.appendChild(desc);
  } else {
    const label = document.createElement("div");
    label.innerText = desc;
    container.appendChild(label);
  }

  const radios = document.createElement("div");
  radios.classList.add("radio");
  container.appendChild(radios);

  values.forEach((value, i) => {
    const div = document.createElement("div");
    radios.appendChild(div);

    const input = document.createElement("input");
    input.type = "radio";
    input.id = id + i;
    input.name = id;
    input.value = value;
    if (value === defaultValue) {
      input.setAttribute("checked", "checked");
    }
    input.onclick = () => callback(value);
    div.appendChild(input);

    const label = document.createElement("label");
    label.setAttribute("for", input.id);
    if (labelMapper !== undefined) {
      label.innerText = labelMapper(value, i);
    } else {
      label.innerText = value;
    }
    div.appendChild(label);
  });

  return container;
}

function createLanguageButtons(callback) {
  const langs = document.querySelector("#langs");
  const languages = [
    ...Object.keys(window.Constants.LOCALIZATION_LANGUAGES),
    "en-GB", // English (GB) in Home Assistant
    "es-419", // Español (Latin America)
    "eo", // Esperanto (unsupported by Horizon Card)
  ];
  languages.filter((value, index) => languages.indexOf(value) === index)
    .sort()
    .forEach(lang => {
    const langButton = document.createElement("button");
    langButton.innerText = lang;
    langButton.onclick = () => callback(lang);
    langs.appendChild(langButton);
  });
}

function createButton(container, label, callback) {
    const button = document.createElement("button");
    button.innerText = label;
    button.onclick = () => callback();
    container.appendChild(button);
}

function localizeMock(key) {
  if (key.startsWith("component.sensor.state.moon__phase.")) {
    const words = key.split(".")[4].split("_");
    return words[0][0].toUpperCase() + words[0].substring(1) + " " + words[1];
  } else {
    return key;
  }
}

function defineHaIcon() {
  // Minimal support for <ha-icon>
  class HaIcon extends HTMLElement {
    constructor() {
      super();
    }

    static get observedAttributes() {
      return ["icon"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (this.span) {
        this.span.className = `mdi ${newValue.replace(":", "-")}`;
      }
    }

    connectedCallback() {
      this.attachShadow({mode: "open"});
      this.shadowRoot.innerHTML = `
        <link rel=stylesheet href="https://cdn.materialdesignicons.com/7.2.96/css/materialdesignicons.min.css">
        `;
      this.span = document.createElement("span");
      this.span.style.fontSize = "var(--mdc-icon-size)";
      this.shadowRoot.appendChild(this.span);
    }
  }
  customElements.define("ha-icon", HaIcon);
}
