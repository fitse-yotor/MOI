import { parse, INTENTS } from "./intents.js";
import {
  SECTOR_ALIASES,
  REGION_ALIASES,
  INFRA_CATEGORIES,
  filterEnterprises,
  filterInfrastructure,
  findEnterpriseByName,
  activeCertificates,
  countBySector,
  countByRegion,
  matrix,
  opportunities,
  visibleEnterprises,
} from "./data.js";

const SECTORS = [...new Set(visibleEnterprises("all").map((e) => e.sector))];
const REGIONS = [...new Set(visibleEnterprises("all").map((e) => e.region))];

function chunk(items, size = 8) {
  return items.slice(0, size);
}

function prettyList(names) {
  if (names.length === 0) return "none";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

function scopeLabel(params, user) {
  if (params.region) return params.region;
  if (user?.role === "regional" && user.region) return user.region;
  return null;
}

function enterpriseItems(params, user, scope) {
  const region = scopeLabel(params, user);
  return filterEnterprises(
    {
      sector: params.sector || undefined,
      region: region || params.region || undefined,
      size: params.size || undefined,
      status: params.status || undefined,
      q: params.query || undefined,
    },
    scope
  );
}

/** Heuristic sector recommendation for a region, with the reasoning surfaced. */
function recommendSectors(region, scope) {
  const { grid } = matrix(scope);
  const regionLabel = region || "this region";
  const rows = SECTORS.map((sector) => {
    const existing = (grid[region] && grid[region][sector]) || 0;
    const infraAssets = filterInfrastructure({ region: region || undefined }).length;
    const infraBonus = Math.min(infraAssets, 3);
    const score = infraBonus - existing;
    const exportFriendly = sector === "Textile & Garment" || sector === "Leather & Footwear" || sector === "Food & Beverage";
    return {
      sector,
      existing,
      score: score + (exportFriendly ? 1 : 0),
      infrastructure: infraAssets,
    };
  });
  rows.sort((a, b) => b.score - a.score);
  const top = rows.slice(0, 3);
  const reasons = top.map(
    (r) =>
      `${r.sector} (${r.existing} registered, ${r.infrastructure} nearby infrastructure assets)`
  );
  const text =
    `For ${regionLabel}, the sectors with the most room to grow are: ${prettyList(reasons.map((r) => r.split(" (")[0]))}. ` +
    `This ranking weighs existing competition against supporting infrastructure — lower competition with good power and logistics nearby scores highest. ` +
    `${regionLabel === "this region" ? "Specify a region (e.g. “for Oromia”) for a sharper recommendation." : ""}`;
  return { text, recommendations: top };
}

function gapAnalysis(params, scope) {
  const { grid, sectors, regions } = matrix(scope);
  const targetSector = params.sector;
  const gaps = [];
  for (const region of regions) {
    if (targetSector) {
      const count = grid[region][targetSector] || 0;
      if (count === 0) {
        const infra = filterInfrastructure({ region }).length;
        gaps.push({ region, sector: targetSector, missing: true, infrastructure: infra });
      }
    } else {
      const total = Object.values(grid[region]).reduce((a, b) => a + b, 0);
      const infra = filterInfrastructure({ region }).length;
      gaps.push({ region, enterprises: total, infrastructure: infra });
    }
  }
  if (targetSector) {
    gaps.sort((a, b) => b.infrastructure - a.infrastructure);
    const text = gaps.length
      ? `No ${targetSector} enterprises are currently registered in: ${prettyList(gaps.map((g) => g.region))}. ` +
        `Of these, ${gaps[0].region} has the most supporting infrastructure (${gaps[0].infrastructure} assets) and is the most promising location to develop the sector.`
      : `Every region already has at least one ${targetSector} enterprise registered.`;
    return { text, gaps };
  }
  gaps.sort((a, b) => a.enterprises - b.enterprises);
  const thin = gaps.slice(0, 3);
  const text =
    `Enterprise density varies by region. The thinnest coverage is in: ${prettyList(thin.map((g) => `${g.region} (${g.enterprises} enterprises)`))}. ` +
    `Focusing new industrial development there would balance the national footprint.`;
  return { text, gaps: thin };
}

function answerList(params, user, scope) {
  const items = enterpriseItems(params, user, scope);
  const region = scopeLabel(params, user) || params.region;
  const qualifiers = [params.sector, region, params.size].filter(Boolean).join(" · ");
  const text = items.length
    ? `I found ${items.length} registered ${params.sector || "manufacturing"} entit${items.length === 1 ? "y" : "ies"}${qualifiers ? ` in ${qualifiers}` : ""}: ${prettyList(items.slice(0, 8).map((e) => e.name))}${items.length > 8 ? `, and ${items.length - 8} more` : ""}.`
    : `No registered enterprises match that query${qualifiers ? ` (${qualifiers})` : ""}. Try a different sector or region.`;
  return {
    text,
    payload: {
      type: "enterprises",
      items: chunk(items).map((e) => ({ id: e.id, name: e.name, slug: e.slug, sector: e.sector, region: e.region, size: e.size, employees: e.employees, lat: e.lat, lng: e.lng })),
    },
  };
}

function answerCount(params, scope) {
  const items = enterpriseItems(params, null, scope);
  const bySector = params.sector ? null : countBySector(scope);
  const byRegion = params.region ? null : countByRegion(scope);
  const text = params.sector
    ? `There ${items.length === 1 ? "is" : "are"} ${items.length} ${params.sector} entit${items.length === 1 ? "y" : "ies"}${params.region ? ` in ${params.region}` : ""} in the registry.`
    : params.region
      ? `There ${items.length === 1 ? "is" : "are"} ${items.length} registered entit${items.length === 1 ? "y" : "ies"} in ${params.region}.`
      : `The registry holds ${items.length} enterprises total. The largest sectors are: ${prettyList(Object.entries(bySector).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s, n]) => `${s} (${n})`))}.`;
  return {
    text,
    payload: { type: "counts", count: items.length, bySector, byRegion },
  };
}

function answerInfrastructure(params) {
  const items = filterInfrastructure({ category: params.infraCategory || undefined, region: params.region || undefined });
  if (!items.length) {
    return {
      text: `No infrastructure of that type found${params.region ? ` in ${params.region}` : ""}.`,
      payload: { type: "infrastructure", items: [] },
    };
  }
  const categoryLabel = params.infraCategory ? INFRA_CATEGORIES[params.infraCategory]?.label : "assets";
  const names = items.map((i) => i.name);
  const text = `In ${params.region || "the country"} I found ${items.length} ${(params.infraCategory ? INFRA_CATEGORIES[params.infraCategory]?.label.toLowerCase() : "infrastructure")} asset${items.length === 1 ? "" : "s"}: ${prettyList(names)}.`;
  return {
    text,
    payload: {
      type: "infrastructure",
      items: chunk(items).map((i) => ({ id: i.id, name: i.name, category: i.category, categoryLabel: INFRA_CATEGORIES[i.category]?.label, region: i.region, status: i.status, capacity: i.capacity, description: i.description, lat: i.lat, lng: i.lng })),
    },
  };
}

function answerEnterpriseInfo(enterprise) {
  const certs = activeCertificates(enterprise.name);
  const text = `${enterprise.name} is a ${enterprise.size} ${enterprise.sector} company in ${enterprise.region}, ${enterprise.zone}, established ${enterprise.establishedYear}. It employs ${enterprise.employees} people (capacity utilisation ${enterprise.capacityUtilization}%) and ${enterprise.exportStatus === "Exporting" ? "exports" : "currently sells domestically"}. ${certs.length ? `It holds ${certs.length} active certificate${certs.length === 1 ? "" : "s"}: ${prettyList(certs.map((c) => c.templateName))}.` : "It has no active certificates on record."} Contact: ${enterprise.manager}, ${enterprise.phone}.`;
  return {
    text,
    payload: { type: "enterprise", item: { name: enterprise.name, slug: enterprise.slug, sector: enterprise.sector, region: enterprise.region, employees: enterprise.employees, status: enterprise.status, certificates: certs, lat: enterprise.lat, lng: enterprise.lng } },
  };
}

function answerCertificates(params, scope) {
  const items = enterpriseItems(params, null, scope);
  const withCerts = items
    .map((e) => ({ enterprise: e, certs: activeCertificates(e.name) }))
    .filter((x) => x.certs.length > 0);
  const text = withCerts.length
    ? `${withCerts.length} entit${withCerts.length === 1 ? "y" : "ies"} hold active certificates${params.sector ? ` in ${params.sector}` : ""}: ${prettyList(withCerts.map((x) => x.enterprise.name))}.`
    : `No enterprises match with active certificates.`;
  return {
    text,
    payload: { type: "certificates", items: chunk(withCerts).map((x) => ({ enterprise: x.enterprise.name, slug: x.enterprise.slug, certificates: x.certs })) },
  };
}

function answerOpportunities(params) {
  const region = params.region;
  const items = region ? opportunities.filter((o) => o.region === "Any region" || o.region.includes(region)) : opportunities;
  const text = items.length
    ? `There are ${items.length} open market opportunities${region ? ` for ${region}` : ""}: ${prettyList(items.slice(0, 5).map((o) => o.title))}.`
    : "No open opportunities match right now.";
  return { text, payload: { type: "opportunities", items } };
}

function answerRecommend(params, user, scope) {
  const region = scopeLabel(params, user);
  const { text, recommendations } = recommendSectors(region, scope);
  return {
    text,
    payload: { type: "recommendations", recommendations, region: region || null },
  };
}

const HELP_TEXT =
  "I can answer questions about Ethiopia's manufacturing registry, infrastructure and market opportunities. Try: " +
  "“list textile companies in Oromia”, “how many food enterprises in Amhara?”, “where are the industrial parks?”, " +
  "“which sector should Dire Dawa invest in?”, “what infrastructure supports leather in Hawassa?”, or “who has an export permit?”.";

/**
 * Entry point. `ctx` carries the request context: { question, role, region,
 * enterpriseName, scope } where scope is "public" (verified only) or "all".
 */
export function answer(question, ctx = {}) {
  const { role, region, enterpriseName, scope = "all" } = ctx;
  const { intent, params } = parse(question);
  const user = { role, region, enterpriseName };
  if (!params.query) {
    const named = findEnterpriseByName(question);
    if (named && (intent === INTENTS.ENTERPRISE_INFO || intent === INTENTS.LIST)) params.query = named.name;
  }

  let result;
  switch (intent) {
    case INTENTS.COUNT:
      result = answerCount(params, scope);
      break;
    case INTENTS.GAP:
      result = gapAnalysis(params, scope);
      break;
    case INTENTS.RECOMMEND:
      result = answerRecommend(params, user, scope);
      break;
    case INTENTS.INFRASTRUCTURE:
      result = answerInfrastructure(params);
      break;
    case INTENTS.CERTIFICATES:
      result = answerCertificates(params, scope);
      break;
    case INTENTS.OPPORTUNITIES:
      result = answerOpportunities(params);
      break;
    case INTENTS.ENTERPRISE_INFO: {
      const named = findEnterpriseByName(question) || (role === "enterprise" ? findEnterpriseByName(enterpriseName) : null);
      result = named ? answerEnterpriseInfo(named) : answerList(params, user, scope);
      break;
    }
    case INTENTS.HELP:
      result = { text: HELP_TEXT, payload: { type: "help" } };
      break;
    default:
      result = answerList(params, user, scope);
  }

  return {
    intent,
    ...result,
    suggestions: buildSuggestions(intent, params),
  };
}

function buildSuggestions(intent, params) {
  const pool = [
    "List food enterprises in Amhara",
    "How many textile companies are there?",
    "Which sector should Dire Dawa invest in?",
    "Where are the power plants?",
    "Who holds active export permits?",
    "Tell me about Bole Lemi Garments PLC",
  ];
  const filtered = pool.filter((s) => !(params.sector && s.toLowerCase().includes(params.sector.toLowerCase())));
  return filtered.slice(0, 3);
}
