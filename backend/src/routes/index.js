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
import licensesRoutes from "./licenses.routes.js";
import paymentsRoutes from "./payments.routes.js";
import chatRoutes from "./chat.routes.js";

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
router.use("/licenses", licensesRoutes);
router.use("/payments", paymentsRoutes);
router.use("/chat", chatRoutes);

export default router;
