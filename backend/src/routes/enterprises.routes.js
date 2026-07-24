import { Router } from "express";
import { enterprises, sectorSummary, masterData } from "../data/enterprises.js";
import { authorize } from "../middleware/auth.js";

const router = Router();
let nextNum = 1009;

function scopeToOwnEnterprise(items, user) {
  return user.role === "enterprise" ? items.filter((e) => e.name === user.enterpriseName) : items;
}

router.get("/", authorize("enterprises", "view"), (req, res) => {
  const { region, sector, size, status, q } = req.query;
  let result = scopeToOwnEnterprise(enterprises, req.user);
  if (region && region !== "all") result = result.filter((e) => e.region === region);
  if (sector && sector !== "all") result = result.filter((e) => e.sector === sector);
  if (size && size !== "all") result = result.filter((e) => e.size === size);
  if (status && status !== "all") result = result.filter((e) => e.status === status);
  if (q) {
    const needle = q.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(needle) || e.tin.includes(needle));
  }
  res.json({ total: req.user.role === "enterprise" ? result.length : 12480, count: result.length, items: result, filters: masterData });
});

router.get("/sectors", authorize("enterprises", "view"), (req, res) => {
  res.json({ items: sectorSummary });
});

router.get("/:id", authorize("enterprises", "view"), (req, res, next) => {
  const item = enterprises.find((e) => e.id === req.params.id);
  if (!item) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  res.json({ item });
});

router.post("/", authorize("enterprises", "create"), (req, res) => {
  const body = req.body || {};
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
    industrialPark: body.industrialPark || "—",
    capacityUtilization: Number(body.capacityUtilization) || 0,
  };
  enterprises.push(item);
  res.status(201).json({ item });
});

router.put("/:id", authorize("enterprises", "edit"), (req, res, next) => {
  const item = enterprises.find((e) => e.id === req.params.id);
  if (!item) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  if (req.user.role === "enterprise" && item.name !== req.user.enterpriseName) {
    const err = new Error("You can only edit your own enterprise's profile");
    err.status = 403;
    return next(err);
  }
  Object.assign(item, req.body || {});
  res.json({ item });
});

router.delete("/:id", authorize("enterprises", "delete"), (req, res, next) => {
  const idx = enterprises.findIndex((e) => e.id === req.params.id);
  if (idx === -1) {
    const err = new Error(`Enterprise ${req.params.id} not found`);
    err.status = 404;
    return next(err);
  }
  enterprises.splice(idx, 1);
  res.status(204).end();
});

export default router;
