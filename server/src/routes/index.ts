import { Router } from "express";
const router = Router();

import groupsRouter from "./groups-router";
import rolesRouter from "./roles-router";

router.use("/groups", groupsRouter);
router.use("/roles", rolesRouter);

export default router;
