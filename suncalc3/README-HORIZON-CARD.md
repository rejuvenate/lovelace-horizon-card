# Local copy of suncalc3

This is a copy of module suncalc3 v2.0.5 with some minor modifications to improve its time zone handling.

Be careful if you feel you need to make adjustments in it.

## Modifications

`SunCalc.getSunTimes` and `SunCalc.getMoonTimes` - added additional argument `dateAsIs`, that makes the function use the provided `dateValue` as is, instead of using non-TZ friendly logic to set the time part of the value to noon.

```js
SunCalc.getSunTimes = function (dateValue, lat, lng, height, addDeprecated, inUTC, dateAsIs) = {
  ...
}

SunCalc.getMoonTimes = function (dateValue, lat, lng, inUTC, dateAsIs) = {
  ...
}
```

## References

- https://github.com/hypnos3/suncalc3
- https://yarn.pm/suncalc3
- https://www.npmjs.com/package/suncalc3
