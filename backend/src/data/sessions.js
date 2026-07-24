import crypto from "node:crypto";

const sessions = new Map();

export function createSession(username) {
  const token = crypto.randomUUID();
  sessions.set(token, username);
  return token;
}

export function getSessionUsername(token) {
  return sessions.get(token);
}

export function destroySession(token) {
  sessions.delete(token);
}
