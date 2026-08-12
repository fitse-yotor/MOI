import crypto from "node:crypto";

// Demo credentials are still plaintext here because this is an evaluation
// build, but they are never stored as-is in memory: at module load each
// password is converted to a salted scrypt hash, and login compares hashes.
const DEMO_ACCOUNTS = [
  { username: "federal.admin", password: "Federal@123", role: "federal", name: "Tsion Bekele", initials: "TB", email: "tsion.bekele@moi.gov.et" },
  { username: "regional.officer", password: "Regional@123", role: "regional", name: "Abrham Girma", initials: "AG", email: "abrham.girma@moi.gov.et", region: "Oromia" },
  { username: "woreda.officer", password: "Woreda@123", role: "woreda", name: "Helen Tesfaye", initials: "HT", email: "helen.tesfaye@moi.gov.et", region: "Addis Ababa" },
  { username: "policy.analyst", password: "Analyst@123", role: "analyst", name: "Kalkidan Molla", initials: "KM", email: "kalkidan.molla@moi.gov.et" },
  { username: "enterprise.mgr", password: "Enterprise@123", role: "enterprise", name: "Aster Kebede", initials: "AK", email: "aster.kebede@bolelemi.example.et", enterpriseName: "Bole Lemi Garments PLC" },
];

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

export function verifyPassword(password, stored) {
  const [saltHex, keyHex] = (stored || "").split(":");
  if (!saltHex || !keyHex) return false;
  const key = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  return crypto.timingSafeEqual(key, Buffer.from(keyHex, "hex"));
}

export const accounts = DEMO_ACCOUNTS.map(({ password, ...rest }) => ({
  ...rest,
  passwordHash: hashPassword(password),
}));
