[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)


# Lovelace Horizon Card

A [Home Assistant Dashboard Card](https://www.home-assistant.io/dashboards/) available through the [Home Assistant Community Store](https://hacs.xyz) and inspired by Google Weather (pre 2024 version).

Lovelace Horizon Card is a fork of the original [home-assistant-sun-card](https://github.com/AitorDB/home-assistant-sun-card) project by [@AitorDB](https://github.com/AitorDB) to continue the great work and distribute the responsibility of supporting and advancing the project among a team of people.

Consider joining us! Click [here to fork](https://github.com/rejuvenate/lovelace-horizon-card/fork)

## Introduction

The Horizon Card tracks the position of the Sun and the Moon over the horizon and shows the times of various Sun and Moon events, as well as their current azimuth and elevation, in a visually appealing and easy-to-read format.

|                                       Light theme default look                                        |                                       Dark theme default look                                        |
| :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![](https://raw.githubusercontent.com/rejuvenate/lovelace-horizon-card/main/images/default-light.png) | ![](https://raw.githubusercontent.com/rejuvenate/lovelace-horizon-card/main/images/default-dark.png) |

|                                       Light theme full look                                        |                                       Dark theme full look                                        |
| :------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------: |
| ![](https://raw.githubusercontent.com/rejuvenate/lovelace-horizon-card/main/images/full-light.png) | ![](https://raw.githubusercontent.com/rejuvenate/lovelace-horizon-card/main/images/full-dark.png) |

### How it works

The card will show the Sun and the Moon as they travel across the horizon from East to West. Both celestial bodies will be shown when above or below the horizon.

The current view shows a period of 24 hours centered around the local solar noon. This means that the Sun will continue to travel to the far end of the graph until it reaches solar midnight, which may be some time before or after midnight in your local time zone. Once solar midnight is reached, the view will reset and start showing the data for the next day.

In the Northern hemisphere, East is on the left, South is in the middle (when the Sun is in its highest position), and West is on the right. You are facing South and the Sun travels left-to-right.

In the Southern hemisphere, West is on the left, North is in the middle (when the Sun is in its highest position), and East is on the right. You are facing North and the Sun travels right-to-left. You can disable the direction flip by setting `southern_flip: false`. This will also affect the sunset/sunrise, dawn/dusk, and moonrise/moonset times shown on the card.

The elevation of the Sun follows a predetermined curve that approximates the actual elevation, while the elevation of the Moon affects its vertical position in the graph. The scale for the Moon elevation is logarithmic, so lower elevations will appear higher (above horizon) or lower (below horizon).

If showing the moon phase is enabled, the icon will be rotated to match the approximate view for your latitude. You can disable this by setting `moon_phase_rotation: 0` or set a different angle to match your location or preferences.

## Installation

Please ensure you have [HACS](https://hacs.xyz/), the [Sun integration](https://www.home-assistant.io/integrations/sun/) and the [Moon Integration](https://www.home-assistant.io/integrations/moon/) (_for the moon info_) enabled in your Home Assistant setup.

If you have My Home Assistant configured, simply click here:

[![Open your Home Assistant instance and open the lovelace-horizon-card project inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=rejuvenate&repository=lovelace-horizon-card)

Otherwise follow these steps:

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
1. Search for "Horizon Card" or `lovelace-horizon-card` in HACS and install the latest version.

### Manual Installation

Installation via HACS is recommended, but a manual setup is supported.

<details>
<summary>Show detailed instructions</summary>

1. Download the latest [lovelace-horizon-card.js](https://github.com/rejuvenate/lovelace-horizon-card/releases/latest/download/lovelace-horizon-card.js) file.
1. If necessary, create a `www` folder in your configuration folder (where `configuration.yaml` is found).
1. Copy the downloaded file into your `www` folder.
1. Add the resources, depending on whether you manage your Lovelace resources via the UI or YAML:

   1. **UI:** Go to [![My Home Assistant](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources) and click **Add resource** _(or navigate to Settings -> Dashboards -> Resources -> Add Resource)_ and enter:

      **URL**: `/local/lovelace-horizon-card.js`

      **Type**: JavaScript Module

   1. **YAML:** Add the configuration to your `ui-lovelace.yaml`:

      ```yaml
      resources:
        - url: /local/lovelace-horizon-card.js
          type: module
      ```

1. Restart Home Assistant.

</details>

## Setup

### Using UI

1. Access your dashboard, enter edit mode, and click on **Add card**. You should be able to find **Custom: Horizon Card** in the list.
2. In the UI editor, customize the card by modifying its configuration as detailed in the Config section below.

> Note: If **Custom: Horizon Card** doesn't appear, clear the cache and reload the page.

### Using YAML

1. Add a new card with `type: custom:horizon-card` to your cards list and include any additional configuration from the Config section below.

> Note: If you encounter an error like _Custom element doesn't exist_, clear the cache and reload the page.

## Configuration

### General options

| Name                | Accepted values                 | Description                                                      | Default                                                        |
| ------------------- | ------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------- |
| title               | _string_                        | Card title                                                       | Doesn't display a title by default                             |
| moon                | _boolean_                       | Shows the Moon together with the Sun                             | `true`                                                         |
| refresh_period      | _number_                        | Refresh period between updates, in seconds                       | `60`                                                           |
| fields              | See [below](#visibility-fields) | Fine-tuned control over visible fields                           |                                                                |
| southern_flip       | _boolean_                       | Draws the graph and accompanying times in the opposite direction | `true` in the Southern hemisphere, `false` in the Northern one |
| moon_phase_rotation | _number_                        | Angle in degrees for rotating the moon phase icon                | Determined from the latitude                                   |

_Example: [here](#example-config)_

### Advanced options

In general, you should not need to set any of these as they override Home Assistant's settings or set debug options.

| Name          | Accepted values                              | Description                                                                                                                   | Default                                                     |
| ------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| language      | See [below](#languages)                      | Changes card language                                                                                                         | Home Assistant profile language or English if not supported |
| time_format   | `language`, `12`, `24`                       | Set to `12` or `24` to force 12/24 hour clock, `language` follow the language representation                                  | `language`                                                  |
| number_format | `language`, `comma_decimal`, `decimal_comma` | Set to `comma_decimal` or `decimal_comma` to force 123.45/123,45 number format, `language` follow the language representation | `language`                                                  |
| latitude      | _number_                                     | Latitude used for calculations                                                                                                | Home Assistant latitude                                     |
| longitude     | _number_                                     | Longitude used for calculations                                                                                               | Home Assistant longitude                                    |
| elevation     | _number_                                     | Elevation (above sea) used for calculations                                                                                   | Home Assistant elevation                                    |
| time_zone     | _string_                                     | Time zone (IANA) used for calculations and time presentation                                                                  | Home Assistant time zone                                    |
| no_card       | _boolean_                                    | Disable card background                                                                                                       | `false`                                                     |
| now           | _Date_                                       | Overrides the current moment shown on the card                                                                                | Current time                                                |
| debug_level   | _number_                                     | Sets debug level, `0` (no debug), `1` and `2`                                                                                 | `0`                                                         |

_Example: [here](#example-config)_

### Visibility Fields

Supported settings inside the `fields` setting:

| Name           | Accepted values | Description                 | Default              |
| -------------- | --------------- | --------------------------- | -------------------- |
| sunrise        | _boolean_       | Show sunrise time           | `true`               |
| sunset         | _boolean_       | Show sunset time            | `true`               |
| dawn           | _boolean_       | Show dawn time              | `true`               |
| noon           | _boolean_       | Show solar noon time        | `true`               |
| dusk           | _boolean_       | Show dusk time              | `true`               |
| azimuth        | _boolean_       | Show Sun and Moon azimuth   | `false`              |
| sun_azimuth    | _boolean_       | Show Sun azimuth            | Value of `azimuth`   |
| moon_azimuth   | _boolean_       | Show Moon azimuth           | Value of `azimuth`   |
| elevation      | _boolean_       | Show Sun and Moon elevation | `false`              |
| sun_elevation  | _boolean_       | Show Sun elevation          | Value of `elevation` |
| moon_elevation | _boolean_       | Show Moon elevation         | Value of `elevation` |
| moonrise       | _boolean_       | Show moonrise time          | `false`              |
| moonset        | _boolean_       | Show moonset time           | `false`              |
| moon_phase     | _boolean_       | Show the Moon phase         | `false`              |

_Example: [here](#example-config)_

### Languages

Supported options for the `language` setting:

- `bg` Bulgarian
- `ca` Catalan
- `cs` Czech
- `da` Danish
- `de` German
- `el` Greek
- `en` English
- `es` Spanish
- `et` Estonian
- `fi` Finnish
- `fr` French
- `gl` Galician
- `he` Hebrew
- `hr` Croatian
- `hu` Hungarian
- `is` Icelandic
- `ja` Japanese
- `ko` Korean
- `it` Italian
- `lt` Lithuanian
- `ms` Malay
- `nb` Norwegian (Bokmål)
- `nl` Dutch
- `nn` Norwegian (Nynorsk)
- `pl` Polish
- `pt` Portuguese (Portugal)
- `pt-BR` Portuguese (Brazil)
- `ro` Romanian
- `ru` Russian
- `sk` Slovak
- `sl` Slovenian
- `sv` Swedish
- `tr` Turkish
- `uk` Ukrainian
- `zh-Hans` Chinese, simplified
- `zh-Hant` Chinese, traditional

_Example: [here](#example-config)_

### Caveats

The Moon phase name (if the field `moon_phase` is enabled) is obtained via the [Moon integration](https://www.home-assistant.io/integrations/moon/). If the integration is not installed, the card will still show the Moon phase as a human-readable constant followed by `(!)`, e.g., `waning_gibbuous (!)`. Due to the way Home Assistant works, the localized Moon phase name will always be in Home Assistant's language and not in the language set for the card via the `language` option.

### Example config

The following YAML configuration illustrates the use of all options.

```yaml
type: custom:horizon-card
title: Example Horizon Card
moon: true
refresh_period: 60
fields:
  sunrise: true
  sunset: true
  dawn: true
  noon: true
  dusk: true
  azimuth: true
  sun_azimuth: true
  moon_azimuth: true
  elevation: true
  sun_elevation: true
  moon_elevation: true
  moonrise: true
  moonset: true
  moon_phase: true
southern_flip: false
moon_phase_rotation: -10
language: en
time_format: language
number_format: language
latitude: 42.55
longitude: 23.25
elevation: 1500
time_zone: Europe/Sofia
no_card: false
now: 2023-07-06T00:30:05+0300
debug_level: 0
```
