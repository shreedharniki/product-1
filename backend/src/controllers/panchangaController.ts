//   import { Request, Response } from "express";

// import {
//   getPanchangam,
//   Observer,
//   tithiNames,
//   nakshatraNames,
//   yogaNames,
//   rashiNames,
//   dayNames,
// } from "@ishubhamx/panchangam-js";

// export const getPanchang = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const {
//       date,
//       latitude,
//       longitude,
//       elevation,
//     } = req.query;

//     const selectedDate = date
//       ? new Date(String(date))
//       : new Date();

//     if (Number.isNaN(selectedDate.getTime())) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid date",
//       });
//     }

//     const lat = latitude
//       ? Number(latitude)
//       : 12.9716;

//     const lng = longitude
//       ? Number(longitude)
//       : 77.5946;

//     const elev = elevation
//       ? Number(elevation)
//       : 920;

//     if (
//       Number.isNaN(lat) ||
//       Number.isNaN(lng) ||
//       Number.isNaN(elev)
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid location values",
//       });
//     }

//     if (lat < -90 || lat > 90) {
//       return res.status(400).json({
//         success: false,
//         message: "Latitude must be between -90 and 90",
//       });
//     }

//     if (lng < -180 || lng > 180) {
//       return res.status(400).json({
//         success: false,
//         message: "Longitude must be between -180 and 180",
//       });
//     }

//     const observer = new Observer(
//       lat,
//       lng,
//       elev
//     );

//     const panchang = getPanchangam(
//       selectedDate,
//       observer,
//       {
//         timezoneOffset: 330,
//       }
//     );

//     return res.status(200).json({
//       success: true,

//       location: {
//         latitude: lat,
//         longitude: lng,
//         elevation: elev,
//         timezone: "Asia/Kolkata",
//         timezoneOffset: 330,
//       },

//       date: selectedDate.toISOString(),

//       panchang: {
//         tithi: {
//           index: panchang.tithi,
//           name: tithiNames[panchang.tithi],
//           endTime: panchang.tithiEndTime,
//         },

//         nakshatra: {
//           index: panchang.nakshatra,
//           name: nakshatraNames[panchang.nakshatra],
//           pada: panchang.nakshatraPada,
//           endTime: panchang.nakshatraEndTime,
//         },

//         yoga: {
//           index: panchang.yoga,
//           name: yogaNames[panchang.yoga],
//           endTime: panchang.yogaEndTime,
//         },

//         karana: panchang.karana,

//         vara: {
//           index: panchang.vara,
//           name: dayNames[panchang.vara],
//         },

//         paksha: panchang.paksha,

//         masa: panchang.masa,

//         ritu: panchang.ritu,

//         ayana: panchang.ayana,

//         samvat: panchang.samvat,

//         moonRashi: {
//           index: panchang.moonRashi,
//           name: rashiNames[panchang.moonRashi],
//         },

//         sunRashi: {
//           index: panchang.sunRashi,
//           name: rashiNames[panchang.sunRashi],
//         },

//         sunrise: panchang.sunrise,
//         sunset: panchang.sunset,

//         moonrise: panchang.moonrise,
//         moonset: panchang.moonset,

//         rahuKalam: panchang.rahuKalam,
//         yamaganda: panchang.yamaganda,
//         gulika: panchang.gulika,

//         choghadiya: panchang.choghadiya,
//         gowri: panchang.gowri,
//       },
//     });
//   } catch (error) {
//     console.error("Panchang Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to calculate Panchang",
//       error:
//         error instanceof Error
//           ? error.message
//           : "Unknown error",
//     });
//   }
// };

import { Request, Response } from "express";

import {
  getPanchangam,
  Observer,
  tithiNames,
  nakshatraNames,
  yogaNames,
  dayNames,
} from "@ishubhamx/panchangam-js";

export const getPanchang = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      date,
      latitude,
      longitude,
      elevation,
    } = req.query;

    // -----------------------------
    // DATE
    // -----------------------------
    const selectedDate = date
      ? new Date(String(date))
      : new Date();

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // -----------------------------
    // LOCATION
    // -----------------------------
    const lat = latitude
      ? Number(latitude)
      : 12.9716;

    const lng = longitude
      ? Number(longitude)
      : 77.5946;

    const elev = elevation
      ? Number(elevation)
      : 920;

    if (
      Number.isNaN(lat) ||
      Number.isNaN(lng) ||
      Number.isNaN(elev)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude, longitude or elevation",
      });
    }

    // -----------------------------
    // OBSERVER
    // -----------------------------
    const observer = new Observer(
      lat,
      lng,
      elev
    );

    // -----------------------------
    // PANCHANG
    // -----------------------------
    const panchang = getPanchangam(
      selectedDate,
      observer,
      {
        timezoneOffset: 330,
      }
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return res.json({
      success: true,

      location: {
        latitude: lat,
        longitude: lng,
        elevation: elev,
        timezone: "Asia/Kolkata",
        timezoneOffset: 330,
      },

      date: selectedDate.toISOString(),

      panchang: {
        // -------------------------
        // TITHI
        // -------------------------
        tithi: {
          index: panchang.tithi,
          name: tithiNames[panchang.tithi],
          startTime: panchang.tithiStartTime,
          endTime: panchang.tithiEndTime,
        },

        // -------------------------
        // NAKSHATRA
        // -------------------------
        nakshatra: {
          index: panchang.nakshatra,
          name: nakshatraNames[panchang.nakshatra],
          pada: panchang.nakshatraPada,
          startTime: panchang.nakshatraStartTime,
          endTime: panchang.nakshatraEndTime,
        },

        // -------------------------
        // YOGA
        // -------------------------
        yoga: {
          index: panchang.yoga,
          name: yogaNames[panchang.yoga],
          endTime: panchang.yogaEndTime,
        },

        // -------------------------
        // KARANA
        // -------------------------
        karana: panchang.karana,

        // -------------------------
        // VARA
        // -------------------------
        vara: {
          index: panchang.vara,
          name: dayNames[panchang.vara],
        },

        // -------------------------
        // PAKSHA
        // -------------------------
        paksha: panchang.paksha,

        // -------------------------
        // MASA
        // -------------------------
        masa: panchang.masa,

        // -------------------------
        // RITU
        // -------------------------
        ritu: panchang.ritu,

        // -------------------------
        // AYANA
        // -------------------------
        ayana: panchang.ayana,

        // -------------------------
        // SAMVAT
        // -------------------------
        samvat: panchang.samvat,

        // -------------------------
        // MOON RASHI
        // -------------------------
        moonRashi: {
          index: panchang.moonRashi.index,
          name: panchang.moonRashi.name,
        },

        // -------------------------
        // SUN RASHI
        // -------------------------
        sunRashi: {
          index: panchang.sunRashi.index,
          name: panchang.sunRashi.name,
        },

        // -------------------------
        // SUN NAKSHATRA
        // -------------------------
        sunNakshatra: panchang.sunNakshatra,

        // -------------------------
        // SUNRISE / SUNSET
        // -------------------------
        sunrise: panchang.sunrise,
        sunset: panchang.sunset,

        // -------------------------
        // MOONRISE / MOONSET
        // -------------------------
        moonrise: panchang.moonrise,
        moonset: panchang.moonset,

        // -------------------------
        // RAHU KALAM
        // -------------------------
        rahuKalam: {
          start: panchang.rahuKalamStart,
          end: panchang.rahuKalamEnd,
        },

        // -------------------------
        // YAMAGANDA
        // -------------------------
        yamaganda: panchang.yamagandaKalam,

        // -------------------------
        // GULIKA
        // -------------------------
        gulika: panchang.gulikaKalam,

        // -------------------------
        // CHOGHADIYA
        // -------------------------
        choghadiya: panchang.choghadiya,

        // -------------------------
        // GOWRI
        // -------------------------
        gowri: panchang.gowri,

        // -------------------------
        // EXTRA MUHURTA
        // -------------------------
        amritKalam: panchang.amritKalam,

        varjyam: panchang.varjyam,

        abhijitMuhurta:
          panchang.abhijitMuhurta,

        brahmaMuhurta:
          panchang.brahmaMuhurta,

        govardhanMuhurta:
          panchang.govardhanMuhurta,

        durMuhurta:
          panchang.durMuhurta,

        // -------------------------
        // TRANSITIONS
        // -------------------------
        tithis: panchang.tithis,

        nakshatras:
          panchang.nakshatras,

        yogas:
          panchang.yogas,

        karanas:
          panchang.karanas,

        rashis:
          panchang.rashis,

        // -------------------------
        // SPECIAL YOGAS
        // -------------------------
        specialYogas:
          panchang.specialYogas,
      },
    });

  } catch (error) {
    console.error(
      "Panchang Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to calculate Panchang",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
};