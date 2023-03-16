# Lovelace Sun Card: A Google Weather Inspired Component for Home Assistant

Elevate your Home Assistant dashboard with the beautifully designed Sun Card, inspired by Google Weather.
This custom card displays sun-related information in a visually appealing and easy-to-read format.

## Revived Fork Information

Lovelace-sun-card is a fork of the original [home-assistant-sun-card](https://github.com/AitorDB/home-assistant-sun-card) project by [@AitorDB](https://github.com/AitorDB) to continue the great work and distribute responsibility of supporting and advancing the project among a team of people. Consider joining us!

## Preview

<p align="center">
<img width="400" src="https://user-images.githubusercontent.com/6829526/118412152-54d93900-b690-11eb-8b2b-e87b4cbcca7f.png"/><img width="400" src="https://user-images.githubusercontent.com/6829526/118412162-64f11880-b690-11eb-9bd7-b8c6c7d8efd8.png"/>
</p>

## Prerequisites

- Ensure you have the [Sun integration](https://www.home-assistant.io/integrations/sun/) enabled in your Home Assistant setup.

## Installation

### HACS

The Home Assistant Sun Card is readily available in the HACS directory.
Learn more about HACS [here](https://hacs.xyz/).

### Manual Installation

1. Download the `home-assistant-sun-card.js` file from the [latest release](https://github.com/rejuvenate/sun-card/releases) and save it to your `configuration/www` folder.
2. Navigate to `Configuration > Lovelace dashboard > Resources` in Home Assistant and click on `Add resource`.
   - Add `/local/community/home-assistant-sun-card.js` to the URL field.
   - Choose `Javascript Module` as the Resource type.

## Setup

### Using UI

1. Access your dashboard, enter edit mode, and click on `Add card`. You should find `Custom: Sun card` in the list.
2. In the UI editor, customize the card by modifying its configuration as detailed in the Config section below.

> Note: If `Custom: Sun card` doesn't appear, reload the page and clear the cache.

### Using YAML

1. Add a new card with `type: 'custom:sun-card'` to your cards list and include any additional configuration from the Config section below.

> Note: If you encounter an error like `Custom element doesn't exist`, reload the page and clear the cache.

## Configuration

| Name          | Accepted values        | Description                          | Default                                             |
| ------------- | ---------------------- | ------------------------------------ | --------------------------------------------------- |
| darkMode      | `boolean`              | Changes card colors to dark or light | Home Assistant dark mode state                      |
| language      | `string`<sup>(1)</sup> | Changes card language                | Home Assistant language or English if not supported |
| showAzimuth   | `boolean`              | Displays azimuth in the footer       | `false`                                             |
| showElevation | `boolean`              | Displays elevation in the footer     | `false`                                             |
| timeFormat    | `'12h'`/`'24h'`        | Displayed time format                | Locale based on Home Assistant language             |
| title         | `string`               | Card title                           | No title displayed by default                       |

<sup>(1)</sup> Supported languages: `da`, `de`, `en`, `es`, `et`, `fi`, `fr`, `hu`, `it`, `nl`, `pl`, `pt-BR`, `ru`, `sl`, `sv`

## Known Issues

- Home Assistant may display next events rather than today's events
