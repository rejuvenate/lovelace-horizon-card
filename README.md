[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

# Lovelace Horizon Card

A [Home Assistant Dashboard Card](https://www.home-assistant.io/dashboards/) available through the [Home Assistant Community Store](https://hacs.xyz) and inspired by Google Weather.

Lovelace Horizon Card is a fork of the original [home-assistant-sun-card](https://github.com/AitorDB/home-assistant-sun-card) project by [@AitorDB](https://github.com/AitorDB) to continue the great work and distribute the responsibility of supporting and advancing the project among a team of people.

Consider joining us!

## Introduction

The Horizon Card tracks the position of the Sun and the Moon over the horizon and shows the times of various Sun and Moon events, as well as their current azimuth and elevation, in a visually appealing and easy-to-read format.

<p align="center">
  <img width="400" alt="Light mode preview" src="https://user-images.githubusercontent.com/6829526/118412152-54d93900-b690-11eb-8b2b-e87b4cbcca7f.png"/>
  <img width="400" alt="Dark mode preview" src="https://user-images.githubusercontent.com/6829526/118412162-64f11880-b690-11eb-9bd7-b8c6c7d8efd8.png"/>
</p>

### How it works

The card will show the Sun and the Moon as they travel across the horizon from East to West. Both celestial bodies will be shown when above or below the horizon.

The current view shows a period of 24 hours centered around the local solar noon. This means that the Sun will continue to travel to the far end of the graph until it reaches solar midnight, which may be some time before or after midnight in your local time zone. Once solar midnight is reached, the view will reset and start showing the data for the next day.

In the Northern hemisphere, East is on the left, South is in the middle (when the Sun is in its highest position), and West is on the right. You are facing South and the Sun travels left-to-right.

In the Southern hemisphere, West is on the left, North is in the middle (when the Sun is in its highest position), and East is on the right. You are facing North and the Sun travels right-to-left. You can disable the direction flip by setting `southern_flip: false`.

The elevation of the Sun follows a predetermined curve that approximates the actual elevation, while the elevation of the Moon affects its vertical position in the graph. The scale for the Moon elevation is logarithmic, so lower elevations will appear higher (above horizon) or lower (below horizon).

If showing the moon phase is enabled, the icon will be rotated to match the approximate view for your latitude. You can disable this by setting `moon_phase_rotation: 0` or set a different angle to match your location or preferences.


## Installation

Please ensure you have the [Sun integration](https://www.home-assistant.io/integrations/sun/) enabled in your Home Assistant setup.

### HACS

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
1. Add the project repository `https://github.com/rejuvenate/lovelace-horizon-card` as a custom repository to HACS, see: https://hacs.xyz/docs/faq/custom_repositories

   <picture>
     <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg">
     <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg">
   </picture><br>
   Addition to the HACS default repository is pending (see: https://github.com/hacs/default/pull/1958).
   This step won't be necessary afterwards.
1. Search for `lovelace-horizon-card` in HACS and install it under the "Lovelace" category.

### Manual Installation

<details>
<summary>Show detailed instructions</summary>

Installation via HACS is recommended, but a manual setup is supported.

1. Download the latest [lovelace-horizon-card.js](https://github.com/rejuvenate/lovelace-horizon-card/releases/latest/download/lovelace-horizon-card.js) file.
1. If necessary, create a `www` folder in your configuration folder (where `configuration.yaml` is found).
1. Copy the downloaded file into your `www` folder.
1. Add the resources, depending on whether you manage your Lovelace resources via the UI or YAML:
   1. **UI:** Go to [![My Home Assistant](https://my.home-assistant.io/badges/lovelace_resources.svg)](https://my.home-assistant.io/redirect/lovelace_resources) and click **Add resource** *(or navigate to Settings -> Dashboards -> Resources -> Add Resource)* and enter:

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

> Note: If you encounter an error like *Custom element doesn't exist*, clear the cache and reload the page.

## Configuration

### General options

| Name                | Accepted values | Description                                       | Default                                                        |
|---------------------|-----------------|---------------------------------------------------|----------------------------------------------------------------|
| title               | *string*        | Card title                                        | Doesn't display a title by default                             |
| moon                | *boolean*       | Shows the Moon together with the Sun              | `true`                                                         |
| refresh_period      | *number*        | Refresh period between updates, in seconds        | 60                                                             |
| fields              | See below       | Fine-tuned control over visible fields            |                                                                |
| southern_flip       | *boolean*       | Draws the graph in the opposite direction         | `true` in the Southern hemisphere, `false` in the Northern one |
| moon_phase_rotation | *number*        | Angle in degrees for rotating the moon phase icon | Determined from the latitude                                   |

### Advanced options

In general, you should not need to set any of these as they override Home Assistant's settings or set debug options.

| Name      | Accepted values                              | Description                                                                    | Default                                             |
|-----------|----------------------------------------------|--------------------------------------------------------------------------------|-----------------------------------------------------|
| language  | See below                                    | Changes card language                                                          | Home Assistant language or English if not supported |
| time_format | `language`, `12`, `24`                       | Set to `12` or `24` to force 12/24 hour clock                                  | `language` - uses default for configured language   |
| number_format | `language`, `comma_decimal`, `decimal_comma` | Set to `comma_decimal` or `decimal_comma` to force 123.45/123,45 number format | `language` - uses default for configured language   |
| latitude  | *number*                                     | Latitude used for calculations                                                 | Home Assistant's latitude                           |
| longitude | *number*                                     | Longitude used for calculations                                                | Home Assistant's longitude                          |
| elevation | *number*                                     | Elevation (above sea) used for calculations                                    | Home Assistant's elevation                          |
| time_zone | *string*                                     | Time zone (IANA) used for calculations and time presentation                   | Home Assistant's time zone                          |
| now       | *Date*                                       | Overrides the current moment shown on the card                                 | None, i.e., always show the current moment          |
| debug_level | *number*                                     | Sets debug level, 0 and up                                                     | 0, i.e., no debug                                   |

### Visibility Fields

Supported settings inside the `fields` setting:

| Name           | Accepted values | Description                 | Default                  |
|----------------|-----------------|-----------------------------|--------------------------|
| sunrise        | *boolean*       | Show sunrise time           | `true`                   |
| sunset         | *boolean*       | Show sunset time            | `true`                   |
| dawn           | *boolean*       | Show dawn time              | `true`                   |
| noon           | *boolean*       | Show solar noon time        | `true`                   |
| dusk           | *boolean*       | Show dusk time              | `true`                   |
| azimuth        | *boolean*       | Show Sun and Moon azimuth   | `false`                  |
| sun_azimuth    | *boolean*       | Show Sun azimuth            | the value of `azimuth`   |
| moon_azimuth   | *boolean*       | Show Moon azimuth           | the value of `azimuth`   |
| elevation      | *boolean*       | Show Sun and Moon elevation | `false`                  |
| sun_elevation  | *boolean*       | Show Sun elevation          | the value of `elevation` |
| moon_elevation | *boolean*       | Show Moon elevation         | the value of `elevation` |
| moonrise       | *boolean*       | Show moonrise time          | `false`                  |
| moonset        | *boolean*       | Show moonset time           | `false`                  |
| moon_phase     | *boolean*       | Show the Moon phase         | `false`                  |

### Languages

Supported options for the `language` setting:

- `bg` Bulgarian
- `ca` Catalan
- `cs` Czech
- `da` Danish
- `de` German
- `en` English
- `es` Spanish
- `et` Estonian
- `fi` Finnish
- `fr` French
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
now: 2023-07-06T00:30:05+0300
debug_level: 0
```
