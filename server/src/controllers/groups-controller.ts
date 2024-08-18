import { NextFunction, Request, Response } from "express";
import { GroupsError } from "../errors/groups-error";
import { GroupService } from "../services/group-service";
import {
  IMainEntityMainDataCreate,
  IMainEntityMainDataRename,
} from "../models/data.model";

class GroupsController {
  private groupService: GroupService;
  constructor() {
    this.groupService = new GroupService();
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await this.groupService.getDataItems();
      return res.status(200).json(groups);
    } catch (e) {
      return next(e);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: IMainEntityMainDataCreate<"groups"> = req.body;
      const newItemAdded = await this.groupService.addEntity(data);
      return res.status(200).json(newItemAdded);
    } catch (e) {
      return next(e);
    }
  };

  rename = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        throw GroupsError.BadRequest("bad-request", "Id is not correct");
      }
      const { newName }: IMainEntityMainDataRename = req.body;
      const renamedItem = await this.groupService.renameEntity(id, newName);

      return res.status(200).json(renamedItem);
    } catch (e) {
      return next(e);
    }
  };

  updateDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || id.trim() === "") {
        throw GroupsError.BadRequest("bad-request", "Id is not correct");
      }
      const { data } = req.body;
      const result = await this.groupService.updateDetails(id, data);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  };
}

const groupController = new GroupsController();

export default groupController;
