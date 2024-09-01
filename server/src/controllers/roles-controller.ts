import { NextFunction, Request, Response } from "express";
import { RolesError } from "../errors/roles-error";
import { RoleService } from "../services/role-service";
import {
  IMainEntityMainDataCreate,
  IMainEntityMainDataRename,
} from "../models/data.model";

class RolesController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.roleService.getData();
      return res.status(200).json(roles);
    } catch (e) {
      return next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IMainEntityMainDataCreate<"roles"> = req.body;
      const newItemAdded = await this.roleService.add(data);

      return res.status(200).json(newItemAdded);
    } catch (e) {
      return next(e);
    }
  };

  rename = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        throw RolesError.BadRequest("bad-request", "Id is not correct");
      }
      const { newName }: IMainEntityMainDataRename = req.body;
      const renamedItem = await this.roleService.rename(id, newName);

      return res.status(200).json(renamedItem);
    } catch (e) {
      return next(e);
    }
  };
  updateDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        throw RolesError.BadRequest("bad-request", "Id is not correct");
      }
      const { data } = req.body;
      const result = await this.roleService.updateDetails(id, data);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  };
}

const rolesController = new RolesController();

export default rolesController;
