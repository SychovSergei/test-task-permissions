import { Router } from "express";
const router = Router();

import groupsController from "../controllers/groups-controller";

router.get("/all", groupsController.getAll);
router.post("/create", groupsController.create);
router.patch("/rename/:id", groupsController.rename);
router.patch("/update-details/:id", groupsController.updateDetails);

export default router;
