import { Router } from "express";
import { masterDataCatalogue, systemParameters } from "../data/config.js";
import { authorize } from "../middleware/auth.js";

const router = Router();

router.get("/master-data", authorize("config", "view"), (req, res) => {
  res.json({ items: masterDataCatalogue });
});

router.post("/master-data", authorize("config", "create"), (req, res) => {
  const { name } = req.body || {};
  if (name && !masterDataCatalogue.includes(name)) masterDataCatalogue.push(name);
  res.status(201).json({ items: masterDataCatalogue });
});

router.delete("/master-data/:index", authorize("config", "delete"), (req, res, next) => {
  const index = Number(req.params.index);
  if (Number.isNaN(index) || index < 0 || index >= masterDataCatalogue.length) {
    const err = new Error("Master data entry not found");
    err.status = 404;
    return next(err);
  }
  masterDataCatalogue.splice(index, 1);
  res.status(204).end();
});

router.get("/parameters", authorize("config", "view"), (req, res) => {
  res.json(systemParameters);
});

router.put("/parameters", authorize("config", "edit"), (req, res) => {
  Object.assign(systemParameters, req.body || {});
  res.json(systemParameters);
});

export default router;
