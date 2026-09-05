"use strict";
//   import { Request, Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPanchang = void 0;
const panchangam_js_1 = require("@ishubhamx/panchangam-js");
const getPanchang = async (req, res) => {
    try {
        const { date, latitude, longitude, elevation, } = req.query;
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
        if (Number.isNaN(lat) ||
            Number.isNaN(lng) ||
            Number.isNaN(elev)) {
            return res.status(400).json({
                success: false,
                message: "Invalid latitude, longitude or elevation",
            });
        }
        // -----------------------------
        // OBSERVER
        // -----------------------------
        const observer = new panchangam_js_1.Observer(lat, lng, elev);
        // -----------------------------
        // PANCHANG
        // -----------------------------
        const panchang = (0, panchangam_js_1.getPanchangam)(selectedDate, observer, {
            timezoneOffset: 330,
        });
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
                    name: panchangam_js_1.tithiNames[panchang.tithi],
                    startTime: panchang.tithiStartTime,
                    endTime: panchang.tithiEndTime,
                },
                // -------------------------
                // NAKSHATRA
                // -------------------------
                nakshatra: {
                    index: panchang.nakshatra,
                    name: panchangam_js_1.nakshatraNames[panchang.nakshatra],
                    pada: panchang.nakshatraPada,
                    startTime: panchang.nakshatraStartTime,
                    endTime: panchang.nakshatraEndTime,
                },
                // -------------------------
                // YOGA
                // -------------------------
                yoga: {
                    index: panchang.yoga,
                    name: panchangam_js_1.yogaNames[panchang.yoga],
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
                    name: panchangam_js_1.dayNames[panchang.vara],
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
                abhijitMuhurta: panchang.abhijitMuhurta,
                brahmaMuhurta: panchang.brahmaMuhurta,
                govardhanMuhurta: panchang.govardhanMuhurta,
                durMuhurta: panchang.durMuhurta,
                // -------------------------
                // TRANSITIONS
                // -------------------------
                tithis: panchang.tithis,
                nakshatras: panchang.nakshatras,
                yogas: panchang.yogas,
                karanas: panchang.karanas,
                rashis: panchang.rashis,
                // -------------------------
                // SPECIAL YOGAS
                // -------------------------
                specialYogas: panchang.specialYogas,
            },
        });
    }
    catch (error) {
        console.error("Panchang Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to calculate Panchang",
            error: error instanceof Error
                ? error.message
                : "Unknown error",
        });
    }
};
exports.getPanchang = getPanchang;
