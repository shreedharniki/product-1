import db from "../config/db";
import { sendMail } from "../utils/mail";
import { subscriptionReminderTemplate } from "../templates/subscriptionReminder";

const REMINDER_DAYS = [7, 3, 2, 1];

const getReminderType = (daysLeft: number): string | null => {
  switch (daysLeft) {
    case 7:
      return "7_days";
    case 3:
      return "3_days";
    case 2:
      return "2_days";
    case 1:
      return "1_day";
    default:
      return null;
  }
};

export const checkPlanExpiry = async () => {
  try {
    const [plans]: any = await db.query(`
      SELECT
        op.id,
        op.organization_id,
        op.expiry_date,
        op.status,
        o.name,
        o.email,
        sp.plan_name
      FROM org_plans op
      INNER JOIN organizations o
        ON o.id = op.organization_id
      INNER JOIN subscription_plans sp
        ON sp.id = op.subscription_plan_id
      WHERE op.status = 'active'
    `);

    const today = new Date();

    for (const plan of plans) {
      const expiryDate = new Date(plan.expiry_date);

      const daysLeft = Math.ceil(
        (expiryDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      console.log(
        `${plan.name} | ${plan.plan_name} | ${daysLeft} day(s) left`
      );

      // ----------------------------
      // Expire Plan
      // ----------------------------
      if (daysLeft < 0) {
        await db.query(
          `UPDATE org_plans
           SET status='expired'
           WHERE id=?`,
          [plan.id]
        );

        console.log(`Plan ${plan.id} marked as expired.`);
        continue;
      }

      // ----------------------------
      // Not a reminder day
      // ----------------------------
      if (!REMINDER_DAYS.includes(daysLeft)) {
        continue;
      }

      const reminderType = getReminderType(daysLeft);

      const [exists]: any = await db.query(
        `
        SELECT id
        FROM subscription_reminders
        WHERE org_plan_id = ?
        AND reminder_type = ?
        `,
        [plan.id, reminderType]
      );

      if (exists.length > 0) {
        console.log(`Reminder already sent to ${plan.email}`);
        continue;
      }

      const html = subscriptionReminderTemplate({
        organizationName: plan.name,
        planName: plan.plan_name,
        expiryDate: plan.expiry_date,
        daysLeft,
        renewLink: `${process.env.CLIENT_URL}/pricing`,
      });

      await sendMail({
        to: plan.email,
        subject: `Your ${plan.plan_name} plan expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
        html,
      });

      await db.query(
        `
        INSERT INTO subscription_reminders
        (org_plan_id, reminder_type)
        VALUES (?, ?)
        `,
        [plan.id, reminderType]
      );

      console.log(`Reminder email sent to ${plan.email}`);
    }

    console.log("Subscription reminder job completed.");
  } catch (error) {
    console.error("Subscription Reminder Error:", error);
  }
};