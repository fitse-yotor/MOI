export const enterprises = [
  { id: "ENT-1001", name: "Bole Lemi Garments PLC", tradeName: "BLG Apparel", tin: "0012348765", sector: "Textile & Garment", subsector: "Apparel", isic: "1410", region: "Addis Ababa", zone: "Bole", size: "Medium", ownership: "Domestic private", employees: 312, exportStatus: "Exporting", status: "Active", establishedYear: 2018, lat: 8.9806, lng: 38.7578, manager: "Aster Kebede", phone: "+251 91 234 5678", industrialPark: "Bole Lemi Industrial Park", capacityUtilization: 78 },
  { id: "ENT-1002", name: "Adama Agro Processing", tradeName: "Adama Agro", tin: "0019287341", sector: "Food & Beverage", subsector: "Agro-processing", isic: "1030", region: "Oromia", zone: "East Shewa", size: "Large", ownership: "Domestic private", employees: 540, exportStatus: "Exporting", status: "Active", establishedYear: 2012, lat: 8.54, lng: 39.27, manager: "Dawit Alemu", phone: "+251 91 345 6789", industrialPark: "—", capacityUtilization: 83 },
  { id: "ENT-1003", name: "Mekelle Metal Works", tradeName: "Mekelle Metal", tin: "0027461982", sector: "Metal & Engineering", subsector: "Fabricated metal", isic: "2599", region: "Tigray", zone: "Mekelle", size: "Small", ownership: "Domestic private", employees: 64, exportStatus: "Domestic", status: "Pending verification", establishedYear: 2020, lat: 13.4967, lng: 39.4753, manager: "Haftom Gebre", phone: "+251 91 456 7890", industrialPark: "—", capacityUtilization: 54 },
  { id: "ENT-1004", name: "Hawassa Leather Products", tradeName: "Hawassa Leather", tin: "0033921874", sector: "Leather & Footwear", subsector: "Leather goods", isic: "1512", region: "Sidama", zone: "Hawassa", size: "Medium", ownership: "Foreign", exportStatus: "Exporting", employees: 228, status: "Active", establishedYear: 2016, lat: 7.05, lng: 38.4667, manager: "Meron Tadesse", phone: "+251 91 567 8901", industrialPark: "Hawassa Industrial Park", capacityUtilization: 71 },
  { id: "ENT-1005", name: "Bahir Dar Textiles PLC", tradeName: "BD Textiles", tin: "0041872365", sector: "Textile & Garment", subsector: "Fabric", isic: "1311", region: "Amhara", zone: "Bahir Dar", size: "Large", ownership: "Domestic private", exportStatus: "Exporting", employees: 701, status: "Active", establishedYear: 2009, lat: 11.5931, lng: 37.3906, manager: "Yohannes Alebachew", phone: "+251 91 678 9012", industrialPark: "Bahir Dar Industrial Park", capacityUtilization: 88 },
  { id: "ENT-1006", name: "Dire Dawa Chemical Industries", tradeName: "DD Chemicals", tin: "0058213764", sector: "Chemicals", subsector: "Industrial chemicals", isic: "2011", region: "Dire Dawa", zone: "Dire Dawa", size: "Medium", ownership: "Domestic private", exportStatus: "Domestic", employees: 156, status: "Suspended", establishedYear: 2014, lat: 9.5931, lng: 41.8661, manager: "Nuru Ahmed", phone: "+251 91 789 0123", industrialPark: "—", capacityUtilization: 41 },
  { id: "ENT-1007", name: "Gondar Food Complex", tradeName: "Gondar Foods", tin: "0064918273", sector: "Food & Beverage", subsector: "Cereal processing", isic: "1061", region: "Amhara", zone: "Gondar", size: "Small", ownership: "Domestic private", exportStatus: "Domestic", employees: 38, status: "Active", establishedYear: 2021, lat: 12.603, lng: 37.4521, manager: "Selamawit Belay", phone: "+251 91 890 1234", industrialPark: "—", capacityUtilization: 62 },
  { id: "ENT-1008", name: "Jimma Coffee Processors", tradeName: "Jimma Coffee", tin: "0071823649", sector: "Food & Beverage", subsector: "Coffee processing", isic: "1079", region: "Oromia", zone: "Jimma", size: "Medium", ownership: "Domestic private", exportStatus: "Exporting", employees: 189, status: "Pending verification", establishedYear: 2017, lat: 7.6667, lng: 36.8333, manager: "Tariku Wakjira", phone: "+251 91 901 2345", industrialPark: "—", capacityUtilization: 69 },
];

export const sectorSummary = [
  { name: "Food & Beverage", count: 3488, share: 28 },
  { name: "Textile & Garment", count: 2746, share: 22 },
  { name: "Leather & Footwear", count: 1747, share: 14 },
  { name: "Metal & Engineering", count: 1872, share: 15 },
  { name: "Chemicals", count: 1498, share: 12 },
  { name: "Other", count: 1129, share: 9 },
];

export const masterData = {
  regions: ["Addis Ababa", "Oromia", "Amhara", "Tigray", "SNNPR", "Sidama", "Dire Dawa"],
  sectors: ["Food & Beverage", "Textile & Garment", "Leather & Footwear", "Chemicals", "Metal & Engineering"],
  sizes: ["Micro", "Small", "Medium", "Large"],
  statuses: ["Active", "Pending verification", "Suspended", "Closed"],
};

let nextNum = 1009;

/**
 * Shared factory used both by the authenticated admin "create enterprise"
 * route and the public self-registration endpoint, so both paths produce
 * consistent records with guaranteed-unique IDs.
 */
export function createEnterprise(body = {}, overrides = {}) {
  const item = {
    id: `ENT-${nextNum++}`,
    name: body.name || "Untitled Enterprise",
    tradeName: body.tradeName || body.name || "",
    tin: body.tin || "",
    sector: body.sector || masterData.sectors[0],
    subsector: body.subsector || "",
    isic: body.isic || "",
    region: body.region || masterData.regions[0],
    zone: body.zone || "",
    size: body.size || masterData.sizes[0],
    ownership: body.ownership || "Domestic private",
    employees: Number(body.employees) || 0,
    exportStatus: body.exportStatus || "Domestic",
    status: body.status || "Pending verification",
    establishedYear: Number(body.establishedYear) || new Date().getFullYear(),
    lat: Number(body.lat) || 9.02,
    lng: Number(body.lng) || 38.75,
    manager: body.manager || "",
    phone: body.phone || "",
    email: body.email || "",
    industrialPark: body.industrialPark || "—",
    capacityUtilization: Number(body.capacityUtilization) || 0,
    source: "admin",
    ...overrides,
  };
  enterprises.push(item);
  return item;
}
