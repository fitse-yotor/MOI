import { SECTOR_ALIASES, REGION_ALIASES, INFRA_ALIASES } from "./data.js";

const INTENTS = {
  COUNT: "count",
  RECOMMEND: "recommend",
  GAP: "gap",
  INFRASTRUCTURE: "infrastructure",
  ENTERPRISE_INFO: "enterprise_info",
  CERTIFICATES: "certificates",
  OPPORTUNITIES: "opportunities",
  LIST: "list",
  HELP: "help",
};

const countRe = /\b(how many|count of|number of|total (number of )?)\b/;
const recommendRe = /\b(recommend|should .* invest|best (sector|industry|region)|which (sector|industry|business) .*(region|invest|start|go)|where should|good place)\b/;
const gapRe = /\b(gap|gaps|missing|lack|lacking|under.?served|shortage|not enough|no (sector|industry|park|factory))\b/;
const infraRe = /\b(infrastructure|parks?|power|electric|energy|hydro|geothermal|wind|substations?|ports?|rails?|railways?|roads?|logistics|expressways?|sezs?|waters?|dams?|telecom|internet|utilities?)\b/;
const certificateRe = /\b(certificates?|licenses?|licences?|compliance|permits?)\b/;
const opportunityRe = /\b(opportunit|match|partner|buyer|supplier|investor|buying|selling)\b/;

/** Best-effort extraction of structured parameters from a free-text question. */
function extractParams(q) {
  const params = { sector: null, region: null, size: null, status: null, infraCategory: null };

  for (const [alias, sector] of Object.entries(SECTOR_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(q)) {
      params.sector = sector;
      break;
    }
  }
  for (const [alias, region] of Object.entries(REGION_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(q)) {
      params.region = region;
      break;
    }
  }
  if (/\b(medium|mid)\b/.test(q)) params.size = "Medium";
  else if (/\b(small)\b/.test(q)) params.size = "Small";
  else if (/\b(large|big)\b/.test(q)) params.size = "Large";
  else if (/\b(micro)\b/.test(q)) params.size = "Micro";

  for (const [alias, cat] of Object.entries(INFRA_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(q)) {
      params.infraCategory = cat;
    }
  }
  return params;
}

export function parse(question) {
  const q = ` ${(question || "").toLowerCase().replace(/[?!.]+/g, " ")} `;
  const params = extractParams(q);

  if (countRe.test(q) && (/\benterpris|compan|industr|factor|manufac|active|regist/.test(q) || params.sector || params.region)) {
    return { intent: INTENTS.COUNT, params };
  }
  if (gapRe.test(q)) return { intent: INTENTS.GAP, params };
  if (recommendRe.test(q)) return { intent: INTENTS.RECOMMEND, params };
  if (certificateRe.test(q)) return { intent: INTENTS.CERTIFICATES, params };
  if (opportunityRe.test(q) && !infraRe.test(q)) return { intent: INTENTS.OPPORTUNITIES, params };
  if (infraRe.test(q)) return { intent: INTENTS.INFRASTRUCTURE, params };
  if (/\btell me (about|more about)\b|\bwhat (is|are|does|do)\b|\bwho (is|are)\b|\binfo (about|on)\b|\bdetails (about|on)\b|\bprofile (of|for)\b|\blearn about\b/.test(q)) {
    return { intent: INTENTS.ENTERPRISE_INFO, params };
  }
  if (/\bhelp\b|\bwhat can you do\b|\bhello\b|\bhi\b/.test(q)) return { intent: INTENTS.HELP, params };
  if (/\benterpris|compan|industr|factor|manufact|active|regist|list|show|find|all\b/.test(q)) {
    return { intent: INTENTS.LIST, params };
  }
  return { intent: INTENTS.LIST, params };
}

export { INTENTS };
