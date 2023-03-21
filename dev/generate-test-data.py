"""
Generates test data (sun event times) for some places and dates.
The test data will be saved to test-data.json in the same directory.

The values are generated with the assumption that the current moment is either
before noon (but after sunrise) or after noon (but before dusk) to mimic
how Home Assistant provides those values:

- next_dawn will be tomorrow's value
- next_dusk will be today's value
- next_midnight will be today's value
- next_noon will be today or tomorrow's value
- next_sunrise will be tomorrow's value
- next_sunset will be today's value

All times will be serialized with TZ +00:00 to mimic Home Assistant.

The generated values for azimuth and elevation correspond to the moment of solar noon.
The elevation is used to detect certain weirdness at high latitudes when the sun is
below the horizon -- since the generated elevation is the maximum for the day it
does the job fine even though it doesn't change as it would in a real environment.
"""
import datetime
import json

from astral import LocationInfo
from astral.sun import azimuth, elevation, dawn, dusk, noon, sunrise, sunset, midnight

# Places to generate data for
PLACES = [
    LocationInfo("Sofia", "BG", "Europe/Sofia", 42.7, 23.3),
    LocationInfo("Berlin", "DE", "Europe/Berlin", 52.5, 13.4),
    LocationInfo("Karasjok", "NO", "Europe/Oslo", 69.5, 25.5),
    LocationInfo("Quito", "EC", "America/Lima", -0.15, -78.5),
    LocationInfo("Sao Paulo", "BR", "America/Sao_Paulo", -23.5, -46.6)
]

# Dates to generate data for with a boolean that indicates if next_noon is the same day
DATES = [
    # Quirky in Karasjok - sunrise for next day, no sunrise/sunset on actual day
    (datetime.date(2023, 1, 19), False),
    (datetime.date(2023, 3, 17), True),
    # Quirky in Karasjok - sunrise is right after sunset before midnight
    (datetime.date(2023, 5, 18), False),
    # Summer solstice
    (datetime.date(2023, 6, 21), True),
    (datetime.date(2023, 9, 21), False),
    (datetime.date(2023, 8, 8), True),
    (datetime.date(2023, 11, 1), False),
    # Winter solstice
    (datetime.date(2023, 12, 22), True)
]


def next_event(place, date, event_fun):
    mod = 0
    while True:
        # Loop until we find the next event, this mimics Home Assistant's Sun integration
        try:
            check_date = date + datetime.timedelta(days=mod)
            return event_fun(place.observer, date=check_date, tzinfo="UTC").isoformat()
        except ValueError:
            mod += 1


def generate_data(place, date_today, tomorrow_noon):
    date_tomorrow = date_today + datetime.timedelta(days=1)

    _noon = noon(place, date_today, place.tzinfo)
    _azimuth = round(azimuth(place, _noon), 2)
    _elevation = round(elevation(place, _noon), 2)

    # tz and tzOffset are used by the dev code
    return {
        "tz": place.tzinfo.zone,
        "tzOffset": noon(place, date_today, place.tzinfo).utcoffset().total_seconds(),
        "sun": {
            'next_dawn': next_event(place, date_tomorrow, dawn),
            'next_dusk': next_event(place, date_today, dusk),
            'next_midnight': next_event(place, date_tomorrow, midnight),
            'next_noon': next_event(place,
                                    date_tomorrow if tomorrow_noon else date_today,
                                    noon),
            'next_rising': next_event(place, date_tomorrow, sunrise),
            'next_setting': next_event(place, date_today, sunset),
            'elevation': _elevation,
            'azimuth': _azimuth,
            'rising': False
        },
    }


data = {}
for date, tomorrow_noon in DATES:
    place_data = {}
    data[str(date)] = place_data
    for place in PLACES:
        place_name = f"{place.name} {place.region} ({place.latitude} {place.longitude})"
        place_data[place_name] = generate_data(place, date, tomorrow_noon)

with open('test-data.json', 'w') as fp:
    json.dump(data, fp, indent=2)
print(json.dumps(data, indent=2))
