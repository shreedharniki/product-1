"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSubscriptionCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const subscriptionReminder_service_1 = require("../services/subscriptionReminder.service");
const startSubscriptionCron = () => {
    // Runs every day at 9:00 AM
    // cron.schedule(
    // "0 9 * * *",
    // async () => {
    //   console.log("Running subscription reminder cron...");
    //   await checkPlanExpiry();
    node_cron_1.default.schedule("*/1 * * * *", async () => {
        console.log("Cron Running...");
        await (0, subscriptionReminder_service_1.checkPlanExpiry)();
    }, {
        timezone: "Asia/Kolkata",
    });
};
exports.startSubscriptionCron = startSubscriptionCron;
