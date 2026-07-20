// Mock SunCalc implementation that returns predictable (almost static) data
export default {
  undefinedMoonTimes: false,

  getSunTimes (now) {
    return {
      civilDawn: this.time(now, '06:00:00'),
      civilDusk: this.time(now, '19:00:00'),
      nadir: this.time(now, '00:30:00', 1),
      solarNoon: this.time(now, '12:30:00'),
      sunriseStart: this.time(now, '06:30:00'),
      sunsetEnd: this.time(now, '18:30:00')
    }
  },

  getPosition () {
    return {
      azimuthDegrees: 180,
      altitudeDegrees: 45
    }
  },

  // Sampled by the graph-frame code to find the Moon's daily elevation extremes. Altitude varies
  // over the day (crossing above and below the horizon, so min and max differ) and its amplitude
  // depends on the latitude (peaking at |lat - 20| = 0), so tests can assert against known inputs
  // and catch swapped lat/lon arguments. Longitude is intentionally ignored.
  getMoonPosition (date, lat) {
    const dayMs = 24 * 60 * 60 * 1000
    const fraction = (date.getTime() % dayMs) / dayMs
    const amplitude = 90 - Math.abs(lat - 20)
    return {
      azimuthDegrees: fraction * 360,
      altitudeDegrees: amplitude * Math.sin(fraction * 2 * Math.PI - Math.PI / 2)
    }
  },

  getMoonData () {
    return {
      azimuthDegrees: 270,
      altitudeDegrees: 90,
      zenithAngle: Math.PI/2,
      parallacticAngleDegrees: 10,
      illumination: {
        fraction: 1,
        phase: {
          id: 'fullMoon'
        }
      }
    }
  },

  getMoonTimes (now) {
    return {
      rise: this.undefinedMoonTimes ? NaN : this.time(now, '13:00:00').value,
      set: this.undefinedMoonTimes? NaN : this.time(now, '22:00:00').value
    }
  },

  time (now, hours, plusDays=0) {
    const parsed = new Date(`1970-01-01T${hours}Z`)
    const result = new Date(now.getTime() + plusDays * 24 * 60 * 60 * 1000)
    result.setUTCHours(parsed.getUTCHours())
    result.setUTCMinutes(parsed.getUTCMinutes())
    result.setUTCSeconds(parsed.getUTCSeconds())
    return {
      value: result,
      valid: true
    }
  },

  setUndefinedMoonTimes (undefinedMoonTimes) {
    this.undefinedMoonTimes = undefinedMoonTimes
  }
}
