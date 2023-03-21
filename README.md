# Lovelace Horizon Card: A Google Weather Inspired Component for Home Assistant

Elevate your Home Assistant dashboard with the beautifully designed Horizon Card, inspired by Google Weather.
This custom card displays sun-related information in a visually appealing and easy-to-read format.

## Revived Fork Information

Lovelace-horizon-card is a fork of the original [home-assistant-sun-card](https://github.com/AitorDB/home-assistant-sun-card) project by [@AitorDB](https://github.com/AitorDB) to continue the great work and distribute responsibility of supporting and advancing the project among a team of people. Consider joining us!

## Preview

<p align="center">
<img width="400" alt="Light mode preview" src="https://user-images.githubusercontent.com/6829526/118412152-54d93900-b690-11eb-8b2b-e87b4cbcca7f.png"/><img width="400" alt="Dark mode preview" src="https://user-images.githubusercontent.com/6829526/118412162-64f11880-b690-11eb-9bd7-b8c6c7d8efd8.png"/>
</p>

## Prerequisites

- Ensure you have the [Sun integration](https://www.home-assistant.io/integrations/sun/) enabled in your Home Assistant setup.

## Installation

### HACS

The Home Assistant Horizon Card is readily available in the HACS directory.
Learn more about HACS [here](https://hacs.xyz/).

### Manual Installation

1. If necessary, create a `www` folder in your configuration folder (where `configuration.yaml` is found).
1. Download the `lovelace-horizon-card.js` file from the [latest release](https://github.com/rejuvenate/lovelace-horizon-card/releases) and save it to your `configuration/www` folder.
1. Navigate to `Configuration > Lovelace dashboard > Resources` in Home Assistant and click on `Add resource`.
   - Add `/local/community/lovelace-horizon-card.js` to the URL field.
   - Choose `Javascript Module` as the Resource type.

## Setup

### Using UI

1. Access your dashboard, enter edit mode, and click on `Add card`. You should find `Custom: Horizon card` in the list.
2. In the UI editor, customize the card by modifying its configuration as detailed in the Config section below.

> Note: If `Custom: Horizon card` doesn't appear, reload the page and clear the cache.

### Using YAML

1. Add a new card with `type: 'custom:horizon-card'` to your cards list and include any additional configuration from the Config section below.

> Note: If you encounter an error like `Custom element doesn't exist`, reload the page and clear the cache.

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
- `it` Italian
- `lt` Lithuanian
- `nb` Norwegian (Bokmål)
- `nl` Dutch
- `nn` Norwegian (Nynorsk)
- `pl` Polish
- `pt-BR` Portuguese (Brazil)
- `ru` Russian
- `sk` Slovak
- `sl` Slovenian
- `sv` Swedish
- `tr` Turkish
- `uk` Ukrainian

## Known Issues

- Home Assistant may display next events rather than today's events
