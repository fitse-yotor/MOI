import { Router } from "express";
import { notifications } from "../data/notifications.js";
import { getExpiringLicenses } from "../data/licenses.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

function daysUntil(dateStr) {
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

// Expiring-license reminders are computed per request (not stored) so they
// always reflect current dates, and are scoped to the requesting user the
// same way the licenses list itself is.
function expiryReminders(user) {
  const expiring = getExpiringLicenses(30).filter(
    (l) => user.role !== "enterprise" || l.enterpriseName === user.enterpriseName
  );
  return expiring.map((l) => ({
    id: `expiry-${l.id}`,
    icon: "⏰",
    title: `${l.licenseNumber} expires in ${daysUntil(l.expiryDate)} days`,
    body: `${l.templateName} for ${l.enterpriseName} is due for renewal by ${l.expiryDate}.`,
    time: "Renewal reminder",
    unread: true,
  }));
}

router.get("/", authorize("notifications", "view"), (req, res) => {
  const items = [...expiryReminders(req.user), ...notifications];
  const unreadCount = items.filter((n) => n.unread).length;
  res.json({ items, unreadCount });
});

router.post("/read-all", authorize("notifications", "view"), (req, res) => {
  notifications.forEach((n) => (n.unread = false));
  res.json({ status: "ok" });
});

export default router;
