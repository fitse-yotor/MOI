import { Router } from "express";
import { accounts, verifyPassword } from "../data/authAccounts.js";
import { createSession, destroySession } from "../data/sessions.js";
import { roles, findRole } from "../data/auth.js";
import { PERMISSIONS } from "../data/permissions.js";
import { authenticate, getBearerToken } from "../middleware/auth.js";

const router = Router();

function toSafeUser(account) {
  const { passwordHash, ...safe } = account;
  return { ...safe, role: findRole(account.role) };
}

router.get("/roles", (req, res) => {
  res.json({ roles });
});

// Never returns passwords — the login page's one-click demo panel uses its
// own client-side copy of these credentials (see frontend demoAccounts config).
router.get("/demo-accounts", (req, res) => {
  res.json({
    items: accounts.map((a) => ({
      username: a.username,
      name: a.name,
      role: a.role,
      roleLabel: findRole(a.role).label,
    })),
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body || {};
  const account = accounts.find((a) => a.username === username && verifyPassword(password || "", a.passwordHash));
  if (!account) {
    const err = new Error("Invalid username or password");
    err.status = 401;
    return next(err);
  }
  const token = createSession(account.username);
  res.json({ token, user: toSafeUser(account), permissions: PERMISSIONS[account.role] });
});

router.post("/logout", authenticate, (req, res) => {
  const token = getBearerToken(req);
  if (token) destroySession(token);
  res.json({ status: "ok" });
});

router.get("/me", authenticate, (req, res) => {
  res.json({ user: toSafeUser(req.user), permissions: PERMISSIONS[req.user.role] });
});

export default router;
