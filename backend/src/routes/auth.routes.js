import { Router } from "express";
import { accounts } from "../data/authAccounts.js";
import { createSession, destroySession } from "../data/sessions.js";
import { roles, findRole } from "../data/auth.js";
import { PERMISSIONS } from "../data/permissions.js";
import { authenticate, getBearerToken } from "../middleware/auth.js";

const router = Router();

function toSafeUser(account) {
  const { password, ...safe } = account;
  return { ...safe, role: findRole(account.role) };
}

router.get("/roles", (req, res) => {
  res.json({ roles });
});

router.get("/demo-accounts", (req, res) => {
  res.json({
    items: accounts.map((a) => ({
      username: a.username,
      password: a.password,
      name: a.name,
      role: a.role,
      roleLabel: findRole(a.role).label,
    })),
  });
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body || {};
  const account = accounts.find((a) => a.username === username && a.password === password);
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
