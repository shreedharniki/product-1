import cron from "node-cron";
import { checkPlanExpiry } from "../services/subscriptionReminder.service";

export const startSubscriptionCron = () => {
  // Runs every day at 9:00 AM
  // cron.schedule(
    // "0 9 * * *",
    // async () => {
    //   console.log("Running subscription reminder cron...");
    //   await checkPlanExpiry();
    cron.schedule("*/1 * * * *", async () => {
    console.log("Cron Running...");
    await checkPlanExpiry();
    
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};