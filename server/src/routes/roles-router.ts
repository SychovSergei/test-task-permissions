import { Router } from "express";
const router = Router();

import rolesController from "../controllers/roles-controller";

router.get("/all", rolesController.getAll);
router.post("/create", rolesController.create);
router.patch("/rename/:id", rolesController.rename);
router.patch("/update-details/:id", rolesController.updateDetails);

export default router;
