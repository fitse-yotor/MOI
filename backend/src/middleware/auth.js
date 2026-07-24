import { accounts } from "../data/authAccounts.js";
import { getSessionUsername } from "../data/sessions.js";
import { can } from "../data/permissions.js";

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export function authenticate(req, res, next) {
  const token = getBearerToken(req);
  const username = token && getSessionUsername(token);
  const account = username && accounts.find((a) => a.username === username);
  if (!account) {
    const err = new Error("Not authenticated");
    err.status = 401;
    return next(err);
  }
  req.user = account;
  req.token = token;
  next();
}

export function authorize(moduleKey, action) {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error("Not authenticated");
      err.status = 401;
      return next(err);
    }
    if (!can(req.user.role, moduleKey, action)) {
      const err = new Error(`Forbidden: ${req.user.role} cannot ${action} ${moduleKey}`);
      err.status = 403;
      return next(err);
    }
    next();
  };
}
