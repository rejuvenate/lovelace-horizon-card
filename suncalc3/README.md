
SunCalc
=======
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/hypnos3/suncalc3/graphs/commit-activity)
[![npm version](https://badge.fury.io/js/suncalc3.svg)](https://badge.fury.io/js/suncalc3)
[![Issues](https://img.shields.io/github/issues/hypnos3/suncalc3.svg?style=flat-square)](https://github.com/hypnos3/suncalc3/issues)
[![code style](https://img.shields.io/badge/Code%20Style-eslint-green.svg)](https://eslint.org/)
[![NPM](https://nodei.co/npm/suncalc3.png)](https://nodei.co/npm/suncalc3/)


SunCalc is a tiny BSD-licensed JavaScript library for calculating sun position,
sunlight phases (times for sunrise, sunset, dusk, etc.),
moon position and lunar phase for the given location and time,
created by [Vladimir Agafonkin](http://agafonkin.com/en) ([@mourner](https://github.com/mourner))
as a part of the [SunCalc.net project](http://suncalc.net).
This version is reworked and enhanced by [@hypnos3](https://github.com/hypnos3). The output of the function is changed in the most times to objects with enhanced properies.

Most calculations are based on the formulas given in the excellent Astronomy Answers articles
about [position of the sun](http://aa.quae.nl/en/reken/zonpositie.html)
and [the planets](http://aa.quae.nl/en/reken/hemelpositie.html).
You can read about different twilight phases calculated by SunCalc
in the [Twilight article on Wikipedia](http://en.wikipedia.org/wiki/Twilight).

## table of contents

- [SunCalc](#suncalc)
	- [table of contents](#table-of-contents)
	- [changed in this library](#changed-in-this-library)
	- [Usage example](#usage-example)
	- [Reference](#reference)
		- [Sunlight times](#sunlight-times)
			- [adding / getting own Sunlight times](#adding--getting-own-sunlight-times)
			- [get specific Sunlight time](#get-specific-sunlight-time)
			- [get Sunlight time for a given azimuth angle for a given date](#get-sunlight-time-for-a-given-azimuth-angle-for-a-given-date)
			- [getting solar time](#getting-solar-time)
		- [Sun position](#sun-position)
		- [Moon position](#moon-position)
		- [Moon illumination](#moon-illumination)
	- [Moon illumination, position and zenith angle](#moon-illumination-position-and-zenith-angle)
		- [Moon rise and set times](#moon-rise-and-set-times)
		- [Moon transit](#moon-transit)
	- [Changelog](#changelog)
			- [2.0.5 &mdash; April 04, 2022](#205--april-04-2022)
			- [2.0.4 &mdash; April 04, 2022](#204--april-04-2022)
			- [2.0.2 &mdash; March 29, 2022](#202--march-29-2022)
			- [2.0.1 &mdash; March 13, 2022](#201--march-13-2022)
			- [2.0.0 &mdash; March 13, 2022](#200--march-13-2022)
			- [1.8.0 &mdash; Dec 22, 2016](#180--dec-22-2016)
			- [1.7.0 &mdash; Nov 11, 2015](#170--nov-11-2015)
			- [1.6.0 &mdash; Oct 27, 2014](#160--oct-27-2014)
			- [1.5.1 &mdash; May 16, 2014](#151--may-16-2014)
			- [1.4.0 &mdash; Apr 10, 2014](#140--apr-10-2014)
			- [1.3.0 &mdash; Feb 21, 2014](#130--feb-21-2014)
			- [1.2.0 &mdash; Mar 07, 2013](#120--mar-07-2013)
			- [1.1.0 &mdash; Mar 06, 2013](#110--mar-06-2013)
			- [1.0.0 &mdash; Dec 07, 2011](#100--dec-07-2011)
			- [0.0.0 &mdash; Aug 25, 2011](#000--aug-25-2011)

## changed in this library

| function names of original SunCalc  | changes in this library   |
|-------------------------------------|---------------------------|
| SunCalc.getTimes                    | SunCalc.getSunTimes       |

| name of the manes of original SunCalc  | changes in this library   |
|----------------------------------------|---------------------------|
| sunrise                                | sunriseEnd                |
| sunset                                 | sunsetStart               |
| dawn                                   | civilDawn                 |
| dusk                                   | civilDusk                 |
| night                                  | astronomicalDusk          |
| nightEnd                               | astronomicalDawn          |
| goldenHour                             | goldenHourDuskStart       |
| goldenHourEnd                          | goldenHourDawnEnd         |

Additional are the output of the function is changed in the most times to objects with more properies. Also JSDOC is added ans type script definitions.

## Usage example

```javascript
// get today's sunlight times for London
let times = SunCalc.getSunTimes(new Date(), 51.5, -0.1);

// format sunrise time from the Date object
let sunriseStr = times.sunriseStart.getHours() + ':' + times.sunrise.getMinutes();

// get position of the sun (azimuth and altitude) at today's sunrise
let sunrisePos = SunCalc.getPosition(times.sunrise, 51.5, -0.1);

// get sunrise azimuth in degrees
let sunriseAzimuth = sunrisePos.azimuth * 180 / Math.PI;
```

SunCalc is also available as an NPM package:

```bash
$ npm install suncalc3
```

```js
let SunCalc = require('suncalc3');
```

## Reference

### Sunlight times

```javascript
/**
 * calculates sun times for a given date and latitude/longitude
 * @param {number|Date} dateValue Date object or timestamp for calculating sun-times
 * @param {number} lat latitude for calculating sun-times
 * @param {number} lng longitude for calculating sun-times
 * @param {number} [height=0]  the observer height (in meters) relative to the horizon
 * @param {boolean} [addDeprecated=false] if true to times from timesDeprecated array will be added to the object
 * @param {boolean} [inUTC=false] defines if the calculation should be in utc or local time (default is local)
 * @return {ISunTimeList} result object of sunTime
 */
SunCalc.getSunTimes(dateValue, lat, lng, height, addDeprecated, inUTC)
```

Returns an object with the following properties:

```javascript
/**
* @typedef {Object} ISunTimeList
* @property {ISunTimeDef} solarNoon - The sun-time for the solar noon (sun is in the highest position)
* @property {ISunTimeDef} nadir - The sun-time for nadir (darkest moment of the night, sun is in the lowest position)
* @property {ISunTimeDef} goldenHourDawnStart - The sun-time for morning golden hour (soft light, best time for photography)
* @property {ISunTimeDef} goldenHourDawnEnd - The sun-time for morning golden hour (soft light, best time for photography)
* @property {ISunTimeDef} goldenHourDuskStart - The sun-time for evening golden hour starts
* @property {ISunTimeDef} goldenHourDuskEnd - The sun-time for evening golden hour starts
* @property {ISunTimeDef} sunriseStart - The sun-time for sunrise starts (top edge of the sun appears on the horizon)
* @property {ISunTimeDef} sunriseEnd - The sun-time for sunrise ends (bottom edge of the sun touches the horizon)
* @property {ISunTimeDef} sunsetStart - The sun-time for sunset starts (bottom edge of the sun touches the horizon)
* @property {ISunTimeDef} sunsetEnd - The sun-time for sunset ends (sun disappears below the horizon, evening civil twilight starts)
* @property {ISunTimeDef} blueHourDawnStart - The sun-time for blue Hour start (time for special photography photos starts)
* @property {ISunTimeDef} blueHourDawnEnd - The sun-time for blue Hour end (time for special photography photos end)
* @property {ISunTimeDef} blueHourDuskStart - The sun-time for blue Hour start (time for special photography photos starts)
* @property {ISunTimeDef} blueHourDuskEnd - The sun-time for blue Hour end (time for special photography photos end)
* @property {ISunTimeDef} civilDawn - The sun-time for dawn (morning nautical twilight ends, morning civil twilight starts)
* @property {ISunTimeDef} civilDusk - The sun-time for dusk (evening nautical twilight starts)
* @property {ISunTimeDef} nauticalDawn - The sun-time for nautical dawn (morning nautical twilight starts)
* @property {ISunTimeDef} nauticalDusk - The sun-time for nautical dusk end (evening astronomical twilight starts)
* @property {ISunTimeDef} amateurDawn - The sun-time for amateur astronomical dawn (sun at 12° before sunrise)
* @property {ISunTimeDef} amateurDusk - The sun-time for amateur astronomical dusk (sun at 12° after sunrise)
* @property {ISunTimeDef} astronomicalDawn - The sun-time for night ends (morning astronomical twilight starts)
* @property {ISunTimeDef} astronomicalDusk - The sun-time for night starts (dark enough for astronomical observations)
* @property {ISunTimeDef} [dawn] - Deprecated: alternate for civilDawn
* @property {ISunTimeDef} [dusk] - Deprecated: alternate for civilDusk
* @property {ISunTimeDef} [nightEnd] - Deprecated: alternate for astronomicalDawn
* @property {ISunTimeDef} [night] - Deprecated: alternate for astronomicalDusk
* @property {ISunTimeDef} [nightStart] - Deprecated: alternate for astronomicalDusk
* @property {ISunTimeDef} [goldenHour] - Deprecated: alternate for goldenHourDuskStart
* @property {ISunTimeDef} [sunset] - Deprecated: alternate for sunsetEnd
* @property {ISunTimeDef} [sunrise] - Deprecated: alternate for sunriseStart
* @property {ISunTimeDef} [goldenHourEnd] - Deprecated: alternate for goldenHourDawnEnd
* @property {ISunTimeDef} [goldenHourStart] - Deprecated: alternate for goldenHourDuskStart
*/
```

These properties contains the sun times for these given times:

| Property            | Description                                                              | SunBH |
| ------------------- | ------------------------------------------------------------------------ | ----- |
| `astronomicalDawn`  | night ends (morning astronomical twilight starts)                        | 18    |
| `amateurDawn`       | amateur astronomical dawn (sun at 12° before sunrise)                    | 15    |
| `nauticalDawn`      | nautical dawn (morning nautical twilight starts)                         | 12    |
| `blueHourDawnStart` | blue Hour start (time for special photography photos starts)             | 8     |
| `civilDawn`         | dawn (morning nautical twilight ends, morning civil twilight starts)     | 6     |
| `blueHourDawnEnd`   | blue Hour end (time for special photography photos end)                  | 4     |
| `goldenHourDawnStart` | morning golden hour (soft light, best time for photography) starts     | -1    |
| `sunriseStart`      | sunrise (top edge of the sun appears on the horizon)                     | 0.833 |
| `sunriseEnd`        | sunrise ends (bottom edge of the sun touches the horizon)                | 0.3   |
| `goldenHourDawnEnd`   | morning golden hour (soft light, best time for photography) ends       | -6    |
| `solarNoon`         | solar noon (sun is in the highest position)                              |       |
| `goldenHourDuskStart` | evening golden hour (soft light, best time for photography) starts     | -6    |
| `sunsetStart`       | sunset starts (bottom edge of the sun touches the horizon)               | 0.3   |
| `sunsetEnd`         | sunset (sun disappears below the horizon, evening civil twilight starts) | 0.833 |
| `goldenHourDuskEnd` | evening golden hour (soft light, best time for photography) ends         | 1     |
| `blueHourDuskStart` | blue Hour start (time for special photography photos starts)             | 4     |
| `civilDusk`         | dusk (evening nautical twilight starts)                                  | 6     |
| `blueHourDuskEnd`   | blue Hour end (time for special photography photos end)                  | 8     |
| `nauticalDusk`      | nautical dusk end (evening astronomical twilight starts)                 | 12    |
| `amateurDusk`       | amateur astronomical dusk (sun at 12° after sunrise)                     | 15    |
| `astronomicalDusk`  | night starts (dark enough for astronomical observations)                 | 18    |
| `nadir`             | nadir (darkest moment of the night, sun is in the lowest position)       |       |

SunBH is the angle of the sun below the horizon

If `addDeprecated` is `true`, the object will have additional objects, with the same properties as other properties. This is to have backwards compatibility to original suncalc library.

| Property            | will equal to                                                            |
| ------------------- | ------------------------------------------------------------------------ |
| `dawn`              | `civilDawn` |
| `dusk`              | `civilDusk` |
| `nightEnd`          | `astronomicalDawn` |
| `night`             | `astronomicalDusk` |
| `nightStart`        | `astronomicalDusk` |
| `sunrise`           | `sunriseStart` |
| `sunset`            | `sunsetEnd` |
| `goldenHour`        | `goldenHourDuskStart` |
| `goldenHourEnd`     | `goldenHourDawnEnd` |
| `goldenHourStart`   | `goldenHourDuskStart` |


Each of the properties will be an object with the following properties:

```javascript
/**
* @typedef {Object} ISunTimeDef
* @property {string} name - The Name of the time
* @property {Date} value - Date object with the calculated sun-time
* @property {number} ts - The time as Unix timestamp
* @property {number} pos - The position of the sun on the time
* @property {number} [elevation] - Angle of the sun on the time (except for solarNoon / nadir)
* @property {number} julian - The time as Julian calendar
* @property {boolean} valid - indicates if the time is valid or not
* @property {boolean} [deprecated] - indicates if the time is a deprecated time name
* @property {string} [nameOrg] - if it is a deprecated name, the original property name
* @property {number} [posOrg] - if it is a deprecated name, the original position
*/
```

#### adding / getting own Sunlight times

```javascript
/** adds a custom time to the times config
 * @param {number} angleAltitude - angle of Altitude/elevation above the horizont of the sun in degrees
 * @param {string} riseName - name of sun rise (morning name)
 * @param {string} setName  - name of sun set (evening name)
 * @param {number} [risePos]  - (optional) position at rise (morning)
 * @param {number} [setPos]  - (optional) position at set (evening)
 * @param {boolean} [degree=true] defines if the elevationAngle is in degree not in radians
 * @return {Boolean} true if new time could be added, false if not (parameter missing; riseName or setName already existing)
 */
SunCalc.addTime(angleInDegrees, riseName, setName, risePos, setPos)
```

Adds a custom time when the sun reaches the given angle to results returned by `SunCalc.getSunTimes`.

- the function tests for validity of the given parameters
  - `riseName` and `setName` must be a non empty `string` and match the regex `/^(?![0-9])[a-zA-Z0-9$_]+$/`
  - `angleInDegrees` must be a number
  - `originalName` must be in the array `SunCalc.times` as `riseName` or `setName`
  - `riseName` and `setName` must not correspond to a `riseName` or `setName` already in the array `SunCalc.times`

Additional this function removes all items from `SunCalc.timesDeprecated` array where the `riseName` or `setName` matches the `alternameName` to prevent errors.

```javascript
/**
 * @typedef ISunTimeNames
 * @type {Object}
 * @property {number} angle     -   angle of the sun position in degrees
 * @property {string} riseName  -   name of sun rise (morning name)
 * @property {string} setName   -   name of sun set (evening name)
 * @property {number} [risePos] -   (optional) position at rise
 * @property {number} [setPos]  -   (optional) position at set
 */
```

`SunCalc.times` property contains all currently defined times of type `Array.<ISunTimeNames>`.

```javascript
/**
 * add an alternate name for a sun time
 * @param {string} alternameName    - alternate or deprecated time name
 * @param {string} originalName     - original time name from SunCalc.times array
 * @return {Boolean} true if could be added, false if not (parameter missing; originalName does not exists; alternameName already existis)
 */
SunCalc.addDeprecatedTimeName(alternameName, originalName)
```

Add a deprecated name

- the function tests for validity of the given parameters
  - `alternameName` must be a non empty `string` and match the regex `/^(?![0-9])[a-zA-Z0-9$_]+$/`
  - `originalName` must be in the array `SunCalc.times` as `riseName` or `setName`
  - `alternameName` must not correspond to a `riseName` or `setName` in the array `SunCalc.times`

`SunCalc.timesDeprecated` property contains all deprecated time names as an `Array.<[string, string]>` - `Array.<deprecatedname, originalName>`.

#### get specific Sunlight time

```javascript
/**
 * calculates sun times for a given date and latitude/longitude
 * calculates the time at which the sun will have a given elevation angle when rising and when setting for a given date and latitude/longitude.
 * @param {number|Date} dateValue Date object or timestamp for calculating sun-times
 * @param {number} lat latitude for calculating sun-times
 * @param {number} lng longitude for calculating sun-times
 * @param {number} elevationAngle sun angle for calculating sun-time
 * @param {number} [height=0]  the observer height (in meters) relative to the horizon
 * @param {boolean} [degree] defines if the elevationAngle is in degree not in radians
 * @param {boolean} [inUTC] defines if the calculation should be in utc or local time (default is local)
 * @return {ISunTimeSingle} result object of single sunTime
 */
SunCalc.getSunTime(dateValue, lat, lng, elevationAngle, height, degree, inUTC)
```

Returns an object with the following properties:

```javascript
/**
* @typedef {Object} ISunTimeSingle
* @property {ISunTimeDef} rise - sun-time for sun rise
* @property {ISunTimeDef} set - sun-time for sun set
* @property {string} [error] - string of an error message if an error occurs
*/
```

`rise` and `set` will be an object equal to the times objects given by `SunCalc.getSunTimes`.

#### get Sunlight time for a given azimuth angle for a given date

```javascript
/**
 * calculates time for a given azimuth angle for a given date and latitude/longitude
 * @param {Date} date start date for calculating sun-position
 * @param {number} nazimuth azimuth for calculating sun-position
 * @param {number} lat latitude for calculating sun-position
 * @param {number} lng longitude for calculating sun-position
 * @param {boolean} [degree] true if the angle is in degree and not in rad
 * @return {Date} result time of sun-position
*/
SunCalc.getSunTimeByAzimuth(date, lat, lng, nazimuth,  degree)
```

Returns an Date object

#### getting solar time


```javascript
/**
 * Calculaes the solar time of the given date in the given latitude and UTC offset.
 * @param {number|Date} dateValue Date object or timestamp for calculating solar time
 * @param {number} utcOffset
 * @param {number} lng
 * @returns Returns the solar time of the given date in the given latitude and UTC offset.
 */
SunCalc.getSolarTime(dateValue, utcOffset, lng)
```

Returns an Date object

### Sun position

```javascript
/**
 * calculates sun position for a given date and latitude/longitude
 * @param {number|Date} dateValue Date object or timestamp for calculating sun-position
 * @param {number} lat latitude for calculating sun-position
 * @param {number} lng longitude for calculating sun-position
 * @return {ISunPosition} result object of sun-position
*/
SunCalc.getPosition(dateValue, lat, lng)
```

Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} ISunPosition
 * @property {number} azimuth - The azimuth of the sun in radians
 * @property {number} altitude - The altitude above the horizon of the sun in radians
 * @property {number} zenith - The zenith of the sun in radians
 * @property {number} azimuthDegrees - The azimuth of the sun in decimal degree
 * @property {number} altitudeDegrees - The altitude of the sun in decimal degree
 * @property {number} zenithDegrees - The zenith of the sun in decimal degree
 * @property {number} declination - The declination of the sun
 */
```

 * `altitude`: sun altitude above the horizon in radians,
 e.g. `0` at the horizon and `PI/2` at the zenith (straight over your head)
 * `azimuth`: sun azimuth in radians (direction along the horizon, measured from south to west),
 e.g. `0` is south and `Math.PI * 3/4` is northwest


### Moon position

```javascript
/**
 * calculates moon position for a given date and latitude/longitude
 * @param {number|Date} dateValue Date object or timestamp for calculating moon-position
 * @param {number} lat latitude for calculating moon-position
 * @param {number} lng longitude for calculating moon-position
 * @return {IMoonPosition} result object of moon-position
 */
SunCalc.getMoonPosition(dateValue, lat, lng)
```

Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} IMoonPosition
 * @property {number} azimuth - The moon azimuth in radians
 * @property {number} altitude - The moon altitude above the horizon in radians
 * @property {number} azimuthDegrees - The moon azimuth in degree
 * @property {number} altitudeDegrees - The moon altitude above the horizon in degree
 * @property {number} distance - The distance of the moon to the earth in kilometers
 * @property {number} parallacticAngle - The parallactic angle of the moon
 * @property {number} parallacticAngleDegrees - The parallactic angle of the moon in degree
 */
```

### Moon illumination

```javascript
/**
 * calculations for illumination parameters of the moon,
 * based on http://idlastro.gsfc.nasa.gov/ftp/pro/astro/mphase.pro formulas and
 * Chapter 48 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
 * @param {number|Date} dateValue Date object or timestamp for calculating moon-illumination
 * @return {IMoonIllumination} result object of moon-illumination
 */
SunCalc.getMoonIllumination(dateValue)
```

Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} IMoonIllumination
 * @property {number} fraction - illuminated fraction of the moon; varies from `0.0` (new moon) to `1.0` (full moon)
 * @property {IPhaseObj} phase - moon phase as object
 * @property {number} phaseValue - The phase of the moon in the current cycle; varies from `0.0` to `1.0`
 * @property {number} angle - The midpoint angle in radians of the illuminated limb of the moon reckoned eastward from the north point of the disk;
 * @property {IMoonIlluminationNext} next - object containing information about the next phases of the moon
 * @remarks the moon is waxing if the angle is negative, and waning if positive
 */

/**
 * @typedef {Object} IPhaseObj
 * @property {number} from - The phase start
 * @property {number} to - The phase end
 * @property {('newMoon'|'waxingCrescentMoon'|'firstQuarterMoon'|'waxingGibbousMoon'|'fullMoon'|'waningGibbousMoon'|'thirdQuarterMoon'|'waningCrescentMoon')} id - id of the phase
 * @property {string} emoji - unicode symbol of the phase
 * @property {string} name - name of the phase
 * @property {string} id - phase name
 * @property {number} weight - weight of the phase
 * @property {string} css - a css value of the phase
 * @property {string} [nameAlt] - an alernate name (not used by this library)
 * @property {string} [tag] - additional tag (not used by this library)
 */

/**
 * @typedef {Object} IMoonIlluminationNext
 * @property {string} date - The Date as a ISO String YYYY-MM-TTTHH:MM:SS.mmmmZ of the next phase
 * @property {number} value - The Date as the milliseconds since 1.1.1970 0:00 UTC of the next phase
 * @property {string} type - The name of the next phase [newMoon, fullMoon, firstQuarter, thirdQuarter]
 * @property {IDateObj} newMoon - Date of the next new moon
 * @property {IDateObj} fullMoon - Date of the next full moon
 * @property {IDateObj} firstQuarter - Date of the next first quater of the moon
 * @property {IDateObj} thirdQuarter - Date of the next third/last quater of the moon
 */
```


Moon phase value should be interpreted like this:

By subtracting the `parallacticAngle` from the `angle` one can get the zenith angle of the moons bright limb (anticlockwise).
The zenith angle can be used do draw the moon shape from the observers perspective (e.g. moon lying on its back). The `SunCalc.getMoonData` function will return the zenith angle.

`SunCalc.moonCycles` contains an array with objects  of type `IPhaseObj` for every phase.

## Moon illumination, position and zenith angle

```javascript
/**
 * calculations moon position and illumination for a given date and latitude/longitude of the moon,
 * @param {number|Date} dateValue Date object or timestamp for calculating moon-illumination
 * @param {number} lat latitude for calculating moon-position
 * @param {number} lng longitude for calculating moon-position
 * @return {IMoonData} result object of moon-illumination
 */
SunCalc.getMoonData(dateValue, lat, lng)
```

Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} IMoonData
 * @property {number} azimuth - The moon azimuth in radians
 * @property {number} altitude - The moon altitude above the horizon in radians
 * @property {number} azimuthDegrees - The moon azimuth in degree
 * @property {number} altitudeDegrees - The moon altitude above the horizon in degree
 * @property {number} distance - The distance of the moon to the earth in kilometers
 * @property {number} parallacticAngle - The parallactic angle of the moon
 * @property {number} parallacticAngleDegrees - The parallactic angle of the moon in degree
 * @property {number} zenithAngle - The zenith angle of the moon
 * @property {IMoonIllumination} illumination - object containing information about the next phases of the moon
 */
```

The `IMoonIllumination` object is the same as the `SunCalc.getMoonIllumination` functions returns.

### Moon rise and set times

```javascript
/**
 * calculations for moon rise/set times are based on http://www.stargazing.net/kepler/moonrise.html article
 * @param {number|Date} dateValue Date object or timestamp for calculating moon-times
 * @param {number} lat latitude for calculating moon-times
 * @param {number} lng longitude for calculating moon-times
 * @param {boolean} [inUTC] defines if the calculation should be in utc or local time (default is local)
 * @return {IMoonTimes} result object of sunTime
 */
SunCalc.getMoonTimes(dateValue, lat, lng, inUTC)
```

Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} IMoonTimes
 * @property {Date|NaN} rise - a Date object if the moon is rising on the given Date, otherwise NaN
 * @property {Date|NaN} set - a Date object if the moon is setting on the given Date, otherwise NaN
 * @property {boolean} alwaysUp - is true if the moon never rises/sets and is always _above_ the horizon during the day
 * @property {boolean} alwaysDown - is true if the moon is always _below_ the horizon
 */
```

By default, it will search for moon rise and set during local user's day (frou 0 to 24 hours).
If `inUTC` is set to true, it will instead search the specified date from 0 to 24 UTC hours.

### Moon transit
```javascript
/**
 * calculated the moon transit
 * @param {number|Date} rise rise time as Date object or timestamp for calculating moon-transit
 * @param {number|Date} set set time as Date object or timestamp for calculating moon-transit
 * @param {number} lat latitude for calculating moon-times
 * @param {number} lng longitude for calculating moon-times
 * @returns {IMoonTransit}
 */
SunCalc.moonTransit(rise, set, lat, lng)
```
Returns an object with the following properties:

```javascript
/**
 * @typedef {Object} IMoonTransit
 * @property {Date|NaN} main - the moon transit date
 * @property {Date|NaN} invert - the inverted moon transit date
 */
```

## Changelog

#### 2.0.5 &mdash; April 04, 2022
- function `SunCalc.addTime(...)` removes all items from `SunCalc.timesDeprecated` array where the new rise or set name matches the `alternameName`.

#### 2.0.4 &mdash; April 04, 2022
- added `SunCalc.addDeprecatedTimeName(...)` function
- renamed `SunCalc.timesAlternate` array to `SunCalc.timesDeprecated`
- added validation to function `addTime`

#### 2.0.2 &mdash; March 29, 2022
- type definitions update

#### 2.0.1 &mdash; March 13, 2022

- added type definitions

#### 2.0.0 &mdash; March 13, 2022

- published as suncalc3 after this library was used by my own with various changes to the original one
- added getSolarTime and moonTransit

#### 1.8.0 &mdash; Dec 22, 2016

- Improved precision of moonrise/moonset calculations.
- Added `parallacticAngle` calculation to `getMoonPosition`.
- Default to today's date in `getMoonIllumination`.
- Fixed incompatibility when using Browserify/Webpack together with a global AMD loader.

#### 1.7.0 &mdash; Nov 11, 2015

- Added `inUTC` argument to `getMoonTimes`.

#### 1.6.0 &mdash; Oct 27, 2014

- Added `SunCalc.getMoonTimes` for calculating moon rise and set times.

#### 1.5.1 &mdash; May 16, 2014

- Exposed `SunCalc.times` property with defined daylight times.
- Slightly improved `SunCalc.getTimes` performance.

#### 1.4.0 &mdash; Apr 10, 2014

- Added `phase` to `SunCalc.getMoonIllumination` results (moon phase).
- Switched from mocha to tape for tests.

#### 1.3.0 &mdash; Feb 21, 2014

- Added `SunCalc.getMoonIllumination` (in place of `getMoonFraction`) that returns an object with `fraction` and `angle`
(angle of illuminated limb of the moon).

#### 1.2.0 &mdash; Mar 07, 2013

- Added `SunCalc.getMoonFraction` function that returns illuminated fraction of the moon.

#### 1.1.0 &mdash; Mar 06, 2013

- Added `SunCalc.getMoonPosition` function.
- Added nadir (darkest time of the day, middle of the night).
- Added tests.

#### 1.0.0 &mdash; Dec 07, 2011

- Published to NPM.
- Added `SunCalc.addTime` function.

#### 0.0.0 &mdash; Aug 25, 2011

- First commit.
