// Mock infrastructure assets for the GIS infrastructure map. Grouped into
// four categories so the map can render a legend + per-layer toggles.
export const INFRA_CATEGORIES = {
  park: { label: "Industrial parks & SEZs", color: "#7c3aed" },
  power: { label: "Power & energy", color: "#d97706" },
  transport: { label: "Transport & logistics", color: "#dc2626" },
  utility: { label: "Water & utilities", color: "#0284c7" },
};

export const infrastructure = [
  // --- Industrial parks & SEZs -------------------------------------------
  { id: "INF-PARK-01", category: "park", name: "Bole Lemi Industrial Park", region: "Addis Ababa", lat: 8.9806, lng: 38.7578, status: "Operational", capacity: "62 ha · 24 sheds", description: "Flagship garment & textile park anchored by export manufacturers." },
  { id: "INF-PARK-02", category: "park", name: "Hawassa Industrial Park", region: "Sidama", lat: 7.05, lng: 38.4667, status: "Operational", capacity: "130 ha · 52 sheds", description: "Lake-side park specialising in garment manufacturing, 100% wastewater recycling." },
  { id: "INF-PARK-03", category: "park", name: "Bahir Dar Industrial Park", region: "Amhara", lat: 11.5931, lng: 37.3906, status: "Operational", capacity: "101 ha", description: "Textiles and agro-processing park beside Lake Tana." },
  { id: "INF-PARK-04", category: "park", name: "Kombolcha Industrial Park", region: "Amhara", lat: 11.0833, lng: 39.7333, status: "Operational", capacity: "76 ha", description: "Garment and textile park with dedicated logistics corridor." },
  { id: "INF-PARK-05", category: "park", name: "Dire Dawa Industrial Park", region: "Dire Dawa", lat: 9.5931, lng: 41.8661, status: "Operational", capacity: "150 ha", description: "Heavy-industry and logistics-oriented park near the railway line." },
  { id: "INF-PARK-06", category: "park", name: "Kilinto Industrial Park", region: "Addis Ababa", lat: 8.9328, lng: 38.7992, status: "Under construction", capacity: "Phased · pharmaceuticals", description: "Pharmaceutical and medical-device hub under phased delivery." },
  { id: "INF-PARK-07", category: "park", name: "Adama Industrial Park", region: "Oromia", lat: 8.54, lng: 39.27, status: "Operational", capacity: "Planned 1,000 ha", description: "Agro-processing and light-manufacturing development." },
  { id: "INF-PARK-08", category: "park", name: "Mekelle Industrial Park", region: "Tigray", lat: 13.4967, lng: 39.4753, status: "Operational", capacity: "36 ha", description: "Garment park serving the northern corridor." },

  // --- Power & energy ----------------------------------------------------
  { id: "INF-PWR-01", category: "power", name: "Grand Ethiopian Renaissance Dam (GERD)", region: "Benishangul-Gumuz", lat: 11.2154, lng: 35.0926, status: "Operational", capacity: "5,150 MW", description: "Africa's largest hydropower plant on the Blue Nile." },
  { id: "INF-PWR-02", category: "power", name: "Gilgel Gibe III", region: "SNNPR", lat: 7.9333, lng: 37.3833, status: "Operational", capacity: "1,870 MW", description: "Run-of-river hydropower on the Omo river." },
  { id: "INF-PWR-03", category: "power", name: "Ashegoda Wind Farm", region: "Tigray", lat: 13.0533, lng: 39.2361, status: "Operational", capacity: "120 MW", description: "Africa's largest wind farm at commissioning." },
  { id: "INF-PWR-04", category: "power", name: "Aluto-Langano Geothermal", region: "Oromia", lat: 7.6167, lng: 38.6833, status: "Expansion", capacity: "7 MW → 75 MW", description: "Pilot geothermal plant expanding to a full field." },
  { id: "INF-PWR-05", category: "power", name: "Adama Wind Farm II", region: "Oromia", lat: 8.62, lng: 39.4, status: "Operational", capacity: "153 MW", description: "Wind farm on the Adama plateau." },
  { id: "INF-PWR-06", category: "power", name: "Addis Ababa 400 kV Substation", region: "Addis Ababa", lat: 8.95, lng: 38.72, status: "Operational", capacity: "400 kV", description: "Main supply node for the capital's industrial load." },
  { id: "INF-PWR-07", category: "power", name: "Koka Dam & Hydro", region: "Oromia", lat: 8.45, lng: 39.15, status: "Operational", capacity: "43 MW", description: "Older hydro station regulating the Awash river." },

  // --- Transport & logistics ---------------------------------------------
  { id: "INF-TRN-01", category: "transport", name: "Port of Djibouti", region: "Djibouti", lat: 11.6, lng: 43.15, status: "Operational", capacity: "Maritime gateway", description: "Ethiopia's principal maritime gateway for imports and exports." },
  { id: "INF-TRN-02", category: "transport", name: "Modjo Dry Port", region: "Oromia", lat: 8.59, lng: 39.12, status: "Operational", capacity: "1.2M TEU", description: "Largest inland dry port, rail-connected to Djibouti." },
  { id: "INF-TRN-03", category: "transport", name: "Addis Ababa–Djibouti Railway", region: "Addis Ababa", lat: 9.02, lng: 38.75, status: "Operational", capacity: "756 km electrified", description: "Ethio-Djibouti standard-gauge line moving bulk cargo." },
  { id: "INF-TRN-04", category: "transport", name: "Dire Dawa Logistics Hub", region: "Dire Dawa", lat: 9.5931, lng: 41.8661, status: "Operational", capacity: "Rail + road junction", description: "Intermodal hub on the corridor to Djibouti." },
  { id: "INF-TRN-05", category: "transport", name: "Addis–Adama Expressway", region: "Oromia", lat: 8.85, lng: 38.9, status: "Operational", capacity: "85 km toll road", description: "First expressway in Ethiopia, linking the capital to the east." },
  { id: "INF-TRN-06", category: "transport", name: "Hawassa Logistics Terminal", region: "Sidama", lat: 7.05, lng: 38.4667, status: "Operational", capacity: "Regional distribution", description: "Distribution terminal serving the industrial corridor." },

  // --- Water & utilities -------------------------------------------------
  { id: "INF-UTL-01", category: "utility", name: "Legedadi Water Treatment Plant", region: "Addis Ababa", lat: 9.1, lng: 38.83, status: "Operational", capacity: "372,000 m³/day", description: "Primary drinking-water supply for Addis Ababa." },
  { id: "INF-UTL-02", category: "utility", name: "Tekeze Dam", region: "Tigray", lat: 13.4, lng: 38.7, status: "Operational", capacity: "300 MW + storage", description: "Reservoir providing irrigation and hydropower in the north." },
  { id: "INF-UTL-03", category: "utility", name: "Awash River Diversion Scheme", region: "Afar", lat: 9.0, lng: 40.1, status: "Operational", capacity: "Irrigation canals", description: "Supplies irrigation for sugarcane and commercial farms." },
  { id: "INF-UTL-04", category: "utility", name: "Addis Ababa Telecom Backbone Node", region: "Addis Ababa", lat: 9.02, lng: 38.75, status: "Operational", capacity: "National IXP", description: "Core internet-exchange node connecting the industrial parks." },
  { id: "INF-UTL-05", category: "utility", name: "Hawassa ICT Park Data Centre", region: "Sidama", lat: 7.05, lng: 38.4667, status: "Operational", capacity: "Tier III", description: "Cloud and hosting capacity serving park enterprises." },
];

export function infrastructureByCategory() {
  const groups = {};
  for (const cat of Object.keys(INFRA_CATEGORIES)) groups[cat] = [];
  for (const item of infrastructure) {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  }
  return groups;
}
