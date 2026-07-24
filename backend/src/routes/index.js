import { Router } from "express";
import dashboardRoutes from "./dashboard.routes.js";
import enterprisesRoutes from "./enterprises.routes.js";
import collectionRoutes from "./collection.routes.js";
import reviewRoutes from "./review.routes.js";
import gisRoutes from "./gis.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import reportsRoutes from "./reports.routes.js";
import linkageRoutes from "./linkage.routes.js";
import benchmarkRoutes from "./benchmark.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import usersRoutes from "./users.routes.js";
import auditRoutes from "./audit.routes.js";
import configRoutes from "./config.routes.js";

const router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/enterprises", enterprisesRoutes);
router.use("/collection", collectionRoutes);
router.use("/review", reviewRoutes);
router.use("/gis", gisRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/reports", reportsRoutes);
router.use("/linkage", linkageRoutes);
router.use("/benchmark", benchmarkRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/users", usersRoutes);
router.use("/audit", auditRoutes);
router.use("/config", configRoutes);

export default router;
