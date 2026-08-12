import { enterprises } from "../data/enterprises.js";
import { infrastructure, INFRA_CATEGORIES } from "../data/infrastructure.js";
import { licenses } from "../data/licenses.js";
import { opportunities } from "../data/linkage.js";

export const SECTOR_ALIASES = {
  textile: "Textile & Garment",
  garment: "Textile & Garment",
  apparel: "Textile & Garment",
  fabric: "Textile & Garment",
  food: "Food & Beverage",
  beverage: "Food & Beverage",
  agro: "Food & Beverage",
  coffee: "Food & Beverage",
  leather: "Leather & Footwear",
  footwear: "Leather & Footwear",
  shoe: "Leather & Footwear",
  chemical: "Chemicals",
  metal: "Metal & Engineering",
  engineering: "Metal & Engineering",
  steel: "Metal & Engineering",
};

export const REGION_ALIASES = {
  "addis ababa": "Addis Ababa",
  addis: "Addis Ababa",
  oromia: "Oromia",
  amhara: "Amhara",
  tigray: "Tigray",
  snnpr: "SNNPR",
  sidama: "Sidama",
  "dire dawa": "Dire Dawa",
};

export const INFRA_ALIASES = {
  park: "park",
  "industrial park": "park",
  sez: "park",
  "economic zone": "park",
  power: "power",
  electric: "power",
  energy: "power",
  hydro: "power",
  geothermal: "power",
  wind: "power",
  substation: "power",
  port: "transport",
  rail: "transport",
  railway: "transport",
  road: "transport",
  logistics: "transport",
  expressway: "transport",
  water: "utility",
  dam: "utility",
  telecom: "utility",
  internet: "utility",
  utility: "utility",
};

/** All enterprises, or only verified (public-facing) ones. */
export function visibleEnterprises(scope = "all") {
  return scope === "public" ? enterprises.filter((e) => e.status === "Active") : enterprises;
}

export function filterEnterprises({ sector, region, size, status, q } = {}, scope = "all") {
  let items = visibleEnterprises(scope);
  if (sector) items = items.filter((e) => e.sector === sector);
  if (region) items = items.filter((e) => e.region === region);
  if (size) items = items.filter((e) => e.size === size);
  if (status) items = items.filter((e) => e.status === status);
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (e) =>
        e.name.toLowerCase().includes(needle) ||
        e.tradeName.toLowerCase().includes(needle) ||
        e.sector.toLowerCase().includes(needle) ||
        e.region.toLowerCase().includes(needle)
    );
  }
  return items;
}

export function filterInfrastructure({ category, region } = {}) {
  let items = infrastructure;
  if (category) items = items.filter((i) => i.category === category);
  if (region) items = items.filter((i) => i.region === region);
  return items;
}

export function findEnterpriseByName(needle) {
  if (!needle) return null;
  const n = needle.toLowerCase();
  return (
    enterprises.find((e) => {
      const names = [e.name.toLowerCase(), e.tradeName.toLowerCase(), e.slug.toLowerCase()];
      return names.some((x) => n.includes(x) || x.includes(n));
    }) || null
  );
}

export function activeCertificates(enterpriseName) {
  return licenses
    .filter((l) => l.enterpriseName === enterpriseName && l.status === "Active")
    .map((l) => ({ licenseNumber: l.licenseNumber, templateName: l.templateName, expiryDate: l.expiryDate }));
}

export function countBySector(scope = "all") {
  const map = {};
  for (const e of visibleEnterprises(scope)) map[e.sector] = (map[e.sector] || 0) + 1;
  return map;
}

export function countByRegion(scope = "all") {
  const map = {};
  for (const e of visibleEnterprises(scope)) map[e.region] = (map[e.region] || 0) + 1;
  return map;
}

/** Enterprise counts per (region, sector) pair — powers gap analysis. */
export function matrix(scope = "all") {
  const regions = [...new Set(visibleEnterprises(scope).map((e) => e.region))];
  const sectors = [...new Set(visibleEnterprises(scope).map((e) => e.sector))];
  const grid = {};
  for (const r of regions) {
    grid[r] = {};
    for (const s of sectors) grid[r][s] = 0;
  }
  for (const e of visibleEnterprises(scope)) grid[e.region][e.sector] += 1;
  return { regions, sectors, grid };
}

export { INFRA_CATEGORIES, opportunities };
