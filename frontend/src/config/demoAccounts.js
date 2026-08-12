// One-click demo logins for local evaluation. These credentials live in the
// client bundle only — the API never returns passwords (see backend
// auth.routes.js, which serves demo profiles without password fields).
export const DEMO_ACCOUNTS = [
  { username: "federal.admin", password: "Federal@123", name: "Tsion Bekele", roleLabel: "Federal Administrator" },
  { username: "regional.officer", password: "Regional@123", name: "Abrham Girma", roleLabel: "Regional Data Officer" },
  { username: "woreda.officer", password: "Woreda@123", name: "Helen Tesfaye", roleLabel: "Woreda Officer" },
  { username: "policy.analyst", password: "Analyst@123", name: "Kalkidan Molla", roleLabel: "Policy Analyst" },
  { username: "enterprise.mgr", password: "Enterprise@123", name: "Aster Kebede", roleLabel: "Enterprise Manager" },
];
