[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

# Lovelace Horizon Card

A [Home Assistant Dashboard Card](https://www.home-assistant.io/dashboards/) available through the [Home Assistant Community Store](https://hacs.xyz) and inspired by Google Weather.

Lovelace Horizon Card is a fork of the original [home-assistant-sun-card](https://github.com/AitorDB/home-assistant-sun-card) project by [@AitorDB](https://github.com/AitorDB) to continue the great work and distribute the responsibility of supporting and advancing the project among a team of people.

Consider joining us!

## Introduction

The Horizon Card tracks the position of the Sun over the horizon and shows the times of various Sun events, as well as the current azimuth and elevation, in a visually appealing and easy-to-read format.

<p align="center">
  <img width="400" alt="Light mode preview" src="https://user-images.githubusercontent.com/6829526/118412152-54d93900-b690-11eb-8b2b-e87b4cbcca7f.png"/>
  <img width="400" alt="Dark mode preview" src="https://user-images.githubusercontent.com/6829526/118412162-64f11880-b690-11eb-9bd7-b8c6c7d8efd8.png"/>
</p>

## Installation

Please ensure you have the [Sun integration](https://www.home-assistant.io/integrations/sun/) enabled in your Home Assistant setup.

### HACS

1. Make sure the [HACS](https://github.com/custom-components/hacs) component is installed and working.
1. Add the project repository `https://github.com/rejuvenate/lovelace-horizon-card` as a custom repository to HACS, see: https://hacs.xyz/docs/faq/custom_repositories

   <picture>
     <source media="(prefers-color-scheme: light)" srcset="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/light-theme/info.svg">
     <img alt="Info" src="https://github.com/Mqxx/GitHub-Markdown/blob/main/blockquotes/badge/dark-theme/info.svg">
   </picture><br>
   Addition to the HACS default repository is pending and shouldn't take longer than a couple of days (see: https://github.com/hacs/default/pull/1808).
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

| Name           | Accepted values      | Description                            | Default                                             |
| -------------- | -------------------- | -------------------------------------- | --------------------------------------------------- |
| component      | `string`             | Changes which sun component to use     | Home Assistant `sun.sun`                            |
| darkMode       | `boolean`            | Changes card colors to dark or light   | Home Assistant dark mode state                      |
| fields         | See below            | Fine-tuned control over visible fields |                                                     |
| language       | See below            | Changes card language                  | Home Assistant language or english if not supported |
| use12hourClock | `boolean`            | Use 12/24 hour clock                   | Uses locale of configured language to decide        |
| title          | `string`             | Card title                             | Doesn't display a title by default                  |

### Visibility Fields

Supported settings inside the `fields` setting:

| Name           | Accepted values | Description    | Default |
|----------------|-----------------|----------------|---------|
| sunrise        | `boolean`       | Show sunrise   | `true`  |
| sunset         | `boolean`       | Show sunset    | `true`  |
| dawn           | `boolean`       | Show dawn      | `true`  |
| noon           | `boolean`       | Show noon      | `true`  |
| dusk           | `boolean`       | Show dusk      | `true`  |
| azimuth        | `boolean`       | Show azimuth   | `false` |
| elevation      | `boolean`       | Show elevation | `false` |

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
- `hu` Hungarian
- `is` Icelandic
- `ja` Japanese
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

## Known Issues

- Home Assistant reports the time of the next occurring Sun event. For example, if you look at the card during the day, the time for sunrise will reflect tomorrow's sunrise and not the one that occurred on the same day.
