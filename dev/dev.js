const settings = {
  darkMode: false,
  intervalUpdateMs: 200,
  stepMinutes: 20,
  date: null,
  place: null,
  lang: "en"
};

fetch("/test-data.json")
  .then((response) => response.json())
  .then((json) => init(json));

function init(testData) {
  const test = document.querySelector("#test");
  const dates = Object.keys(testData);
  const places = Object.keys(testData[dates[0]]);
  settings.date = dates[0];
  settings.place = places[0];

  createRadioButtons("Date", "date", dates, settings.date,
    (date) => {
      settings.date = date;
      update();
  });

  createRadioButtons("Place", "place", places, settings.place,
    (place) => {
      settings.place = place;
      update();
    });

  createRadioButtons("Step (minutes)", "step", [20, 10, 5], settings.stepMinutes, (min) => {
    settings.stepMinutes = min;
    update();
  });

  createRadioButtons("Interval (ms)", "interval", [500, 200, 100], settings.intervalUpdateMs,
    (ms) => {
      settings.intervalUpdateMs = ms;
      resetInterval();
    });

  createRadioButtons("Theme", "theme", ["Light", "Dark"], settings.darkMode ? "Dark" : "Light",
    (theme) => {
      settings.darkMode = theme !== "Light";
      update();
    });

  createLanguageButtons((lang) => {
    settings.lang = lang;
    update();
  });

  let fixedOffset = 6 * 60 * 60 * 1000; // 06:00:00
  let interval = null;

  update();

  resetInterval();

  function update() {
    const hours = Math.floor(fixedOffset / (60 * 60 * 1000));
    const remainingMillis = fixedOffset % (60 * 60 * 1000);
    const minutes = Math.floor(remainingMillis / (60 * 1000));
    const fixedTime = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
    test.setFixedNow(new Date(settings.date + "T" + fixedTime + ":00"));
    document.querySelector("#time").innerText = fixedTime;

    if (settings.darkMode) {
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
    }
    test.setConfig({
      title: "Sunrise & Sunset",
      showAzimuth: true,
      showElevation: true,
      darkMode: settings.darkMode
    });

    const tzOffset = testData[settings.date][settings.place]["tzOffset"];
    const sunData = Object.assign({}, testData[settings.date][settings.place]["sun"]);
    fixAllTimesTz(sunData, tzOffset);

    test.hass = {
      language: settings.lang,
      locale: {
        language: settings.lang
      },
      themes: {
        darkMode: settings.darkMode
      },
      states: {
        "sun.sun": {
          state: "above_horizon",
          attributes: sunData
        }
      }
    };
  }

  function resetInterval() {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(function() {
      fixedOffset += settings.stepMinutes * 60 * 1000;
      if (fixedOffset >= 24 * 60 * 60 * 1000) {
        fixedOffset = 0;
      }
      update();
    }, settings.intervalUpdateMs);
  }

  function fixAllTimesTz(sunData, tzOffset) {
    Object.keys(sunData).forEach(key => {
      if (key.startsWith("next_")) {
        sunData[key] = fixTz(sunData[key], tzOffset);
      }
    });
  }

  function fixTz(date, tzOffset) {
    const original = new Date(date);
    const localTzOffset = original.getTimezoneOffset() * 60;
    return new Date(original.getTime() + localTzOffset * 1000 + tzOffset * 1000).toISOString();
  }
}

function createRadioButtons(desc, id, values, defaultValue, callback) {
  const buttons = document.querySelector("#buttons");
  const container = document.createElement("div");
  container.id = id;
  if (values.length > 5) {
    // I couldn't figure how to make the div grow on its own when the items wrap :(
    container.style.flexGrow = "2.4";
  }
  buttons.appendChild(container);

  const label = document.createElement("div");
  label.innerText = desc;
  container.appendChild(label);

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
    label.innerText = value;
    div.appendChild(label);
  });
}

function createLanguageButtons(callback) {
  const langs = document.querySelector("#langs");
  Object.keys(window.Constants.LOCALIZATION_LANGUAGES).forEach(lang => {
    const langButton = document.createElement("button");
    langButton.innerText = lang;
    langButton.onclick = () => callback(lang);
    langs.appendChild(langButton);
  });
}

