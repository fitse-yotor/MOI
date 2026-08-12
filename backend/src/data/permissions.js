const FULL = { view: true, create: true, edit: true, delete: true, approve: true };
const VIEW = { view: true, create: false, edit: false, delete: false, approve: false };
const NONE = { view: false, create: false, edit: false, delete: false, approve: false };
const vc = (extra) => ({ ...VIEW, ...extra });

/**
 * One row per role, one column per sidebar module. Governs both which nav
 * items render and which mutating API routes a role's token can call —
 * the frontend and backend both read this same shape from /auth/me.
 *
 * `chat` and `advisory` are read-only assistant modules: chat is available to
 * every signed-in role, advisory (decision-support) only to officials and
 * analysts.
 */
export const PERMISSIONS = {
  federal: {
    dashboard: FULL, enterprises: FULL, collection: FULL, review: FULL, gis: FULL,
    analytics: FULL, reports: FULL, linkage: FULL, benchmark: FULL, notifications: FULL,
    users: FULL, audit: VIEW, config: FULL, licenses: FULL, chat: VIEW, advisory: VIEW,
  },
  regional: {
    dashboard: VIEW, enterprises: vc({ create: true, edit: true }), collection: VIEW,
    review: vc({ approve: true }), gis: VIEW, analytics: VIEW,
    reports: vc({ create: true }), linkage: vc({ create: true }), benchmark: VIEW,
    notifications: VIEW, users: NONE, audit: NONE, config: NONE,
    licenses: vc({ create: true, edit: true, approve: true }), chat: VIEW, advisory: VIEW,
  },
  woreda: {
    dashboard: VIEW, enterprises: vc({ create: true, edit: true }), collection: VIEW,
    review: vc({ approve: true }), gis: VIEW, analytics: NONE, reports: NONE,
    linkage: NONE, benchmark: NONE, notifications: VIEW, users: NONE, audit: NONE, config: NONE,
    licenses: VIEW, chat: VIEW, advisory: NONE,
  },
  analyst: {
    dashboard: VIEW, enterprises: VIEW, collection: NONE, review: NONE, gis: VIEW,
    analytics: VIEW, reports: vc({ create: true }), linkage: VIEW, benchmark: VIEW,
    notifications: VIEW, users: NONE, audit: NONE, config: NONE, licenses: VIEW,
    chat: VIEW, advisory: VIEW,
  },
  enterprise: {
    dashboard: VIEW, enterprises: vc({ edit: true }), collection: VIEW, review: VIEW,
    gis: NONE, analytics: NONE, reports: NONE, linkage: vc({ create: true }), benchmark: NONE,
    notifications: VIEW, users: NONE, audit: NONE, config: NONE, licenses: VIEW,
    chat: VIEW, advisory: NONE,
  },
};

export function can(role, moduleKey, action) {
  return !!PERMISSIONS[role]?.[moduleKey]?.[action];
}
