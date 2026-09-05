"use strict";
// import express from "express";
// import cors from "cors";
// import axios from "axios";
// const app = express();
// import authRoutes from './routes/auth.routes';
// import sevasRoutes from './routes/sevas.routes';
// import organizationRoutes from './routes/organization.routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import devoteesRoutes from './routes/devotees.routes';
// import deitiesRoutes from './routes/deities.routes';
// import paymentMethodRoutes from './routes/paymentmethod.routes';
// import sevabookingRoutes from "./routes/sevabooking.routes";
// import trusteesRoutes from './routes/trustees.routes';
// import hundiRoutes from './routes/hundi.routes';
// import templeRoutes from "./routes/temple.routes"
// import tokensRoutes from "./routes/tokens.routes"
// import panchangaRoutes from "./routes/panchanga.routes";
// import subscriptionPlanRoutes from "./routes/subscriptionPlan.routes";
// import moduleRoutes from "./routes/module.routes";
// import usersRoutes from "./routes/usersRoutes";
// // import path from "path";
// // import fs from "fs"
// // node corn every day remaider uncommant in live only
// // import { startSubscriptionCron } from "./cron/subscriptionCronRemaider";
// // startSubscriptionCron();
// // load panchanga names
// // const namesPath = path.join(__dirname, "names.json");
// // const names = JSON.parse(fs.readFileSync(namesPath, "utf8"));
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // 🔥 ADD THIS (important)
// // Panchanga endpoint - this is a mock implementation. In a real application, you would calculate these values based on the date and location, or fetch them from an external API.
// // app.get("/panchanga", (req,res)=>{
// //  const {date} = req.query
// //  if(!date){
// //   return res.json({error:"Date required"})
// //  }
// //  const d = new Date(date)
// //  const day = d.getDate()
// //  const month = d.getMonth()+1
// //  const year = d.getFullYear()
// //  const weekday = d.getDay()
// //  const tithiIndex = (day % 30) || 30
// //  const nakIndex = (day % 27) || 27
// // //  const rashiIndex = (month % 12) || 12
// //  const masaIndex = (month % 12) || 12
// //  const yogaIndex = (day % 27) || 27
// //  const karanaIndex = (day % 60) || 60
// //  const samvatsIndex = ((d.getFullYear()+57) % 60) || 60
// // // paksha
// //   const pakshaKey = day <= 15 ? "shukla" : "krishna"
// //   // shaka year
// //   const shakaYear = year - 78
// //  res.json({
// //   tithi: names.tithis[tithiIndex],
// //   nakshatra: names.nakshatras[nakIndex],
// // //   rashi: names.rashis[rashiIndex],
// //   masa: names.masas[masaIndex],
// //   samvatsara: names.samvats[samvatsIndex],
// //   yoga: names.yogas[yogaIndex],
// //   karana: names.karanas[karanaIndex],
// //   vara: names.varas[weekday],
// //     paksha: names.pakshas[pakshaKey],
// //     hindu_shaka_year: shakaYear
// //  })
// // })
// app.use('/api/auth', authRoutes);
// app.use('/api/v1/organizations', organizationRoutes);
// app.use('/api/v1/temple/sevas', sevasRoutes);
// app.use('/api/v1/temple/devotees', devoteesRoutes);
// app.use('/api/v1/temple/deities', deitiesRoutes);
// app.use('/api/v1/temple/payment-methods', paymentMethodRoutes);
// app.use("/api/v1/temple/seva-bookings", sevabookingRoutes);
// app.use('/api/v1/temple/trustees', trusteesRoutes);
// app.use('/api/v1/hundi', hundiRoutes);
// app.use("/api/v1/temple/temples", templeRoutes);
// app.use("/api/v1/temple/tokens", tokensRoutes);
// // app.use("/api/v1/temples", templeRoutes)
// app.use("/api/v1/panchanga", panchangaRoutes);
// app.use("/api/v1/subscription-plans", subscriptionPlanRoutes);
// app.use("/api/v1/modules", moduleRoutes);
// app.use("/api/v1/users", usersRoutes);
// // app.use('/public', express.static(path.join(__dirname, 'public')));
// export default app;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const sevas_routes_1 = __importDefault(require("./routes/sevas.routes"));
const organization_routes_1 = __importDefault(require("./routes/organization.routes"));
const devotees_routes_1 = __importDefault(require("./routes/devotees.routes"));
const deities_routes_1 = __importDefault(require("./routes/deities.routes"));
const paymentmethod_routes_1 = __importDefault(require("./routes/paymentmethod.routes"));
const sevabooking_routes_1 = __importDefault(require("./routes/sevabooking.routes"));
const trustees_routes_1 = __importDefault(require("./routes/trustees.routes"));
const hundi_routes_1 = __importDefault(require("./routes/hundi.routes"));
const temple_routes_1 = __importDefault(require("./routes/temple.routes"));
const tokens_routes_1 = __importDefault(require("./routes/tokens.routes"));
const panchanga_routes_1 = __importDefault(require("./routes/panchanga.routes"));
const subscriptionPlan_routes_1 = __importDefault(require("./routes/subscriptionPlan.routes"));
const module_routes_1 = __importDefault(require("./routes/module.routes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const path_1 = __importDefault(require("path"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/v1/organizations", organization_routes_1.default);
app.use("/api/v1/temple/sevas", sevas_routes_1.default);
app.use("/api/v1/temple/devotees", devotees_routes_1.default);
app.use("/api/v1/temple/deities", deities_routes_1.default);
app.use("/api/v1/temple/payment-methods", paymentmethod_routes_1.default);
app.use("/api/v1/temple/seva-bookings", sevabooking_routes_1.default);
app.use("/api/v1/temple/trustees", trustees_routes_1.default);
app.use("/api/v1/hundi", hundi_routes_1.default);
app.use("/api/v1/temple/temples", temple_routes_1.default);
app.use("/api/v1/temple/tokens", tokens_routes_1.default);
app.use("/api/v1/panchanga", panchanga_routes_1.default);
app.use("/api/v1/subscription-plans", subscriptionPlan_routes_1.default);
app.use("/api/v1/modules", module_routes_1.default);
app.use("/api/v1/users", usersRoutes_1.default);
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
exports.default = app;
