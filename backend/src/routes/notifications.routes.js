import { Router } from "express";
import { notifications } from "../data/notifications.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/", authorize("notifications", "view"), (req, res) => {
  const unreadCount = notifications.filter((n) => n.unread).length;
  res.json({ items: notifications, unreadCount });
});

router.post("/read-all", authorize("notifications", "view"), (req, res) => {
  notifications.forEach((n) => (n.unread = false));
  res.json({ status: "ok" });
});

export default router;
