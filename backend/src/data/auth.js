export const roles = [
  { id: "federal", label: "Federal Administrator" },
  { id: "regional", label: "Regional Data Officer" },
  { id: "woreda", label: "Woreda Officer" },
  { id: "analyst", label: "Policy Analyst" },
  { id: "enterprise", label: "Enterprise Manager" },
];

export const demoUser = {
  id: "USR-1",
  name: "Tsion Bekele",
  initials: "TB",
  email: "tsion.bekele@moi.gov.et",
  defaultRole: "federal",
};

export function findRole(roleId) {
  return roles.find((r) => r.id === roleId) || roles[0];
}
