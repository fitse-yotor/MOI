import { Router } from "express";
import { enterprises } from "../data/enterprises.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/points", authorize("gis", "view"), (req, res) => {
  const points = enterprises.map((e) => ({
    id: e.id,
    name: e.name,
    sector: e.sector,
    size: e.size,
    lat: e.lat,
    lng: e.lng,
    exportStatus: e.exportStatus,
    employees: e.employees,
    capacityUtilization: e.capacityUtilization,
    region: e.region,
  }));
  res.json({
    items: points,
    clusterSummary: {
      enterprisesInView: 1842,
      industrialParks: 6,
      avgDistanceToPortRoadKm: 14.2,
    },
  });
});

export default router;
