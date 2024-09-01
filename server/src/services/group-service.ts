import { BaseService } from "./base-service";
import { GroupsDto } from "../models/groups.dto";
import { GroupDtoFactory } from "../models/group-dto-factory";

export class GroupService extends BaseService<"groups"> {
  constructor() {
    super("groups");
  }

  async getData(): Promise<GroupsDto> {
    return await GroupDtoFactory.create();
  }
}
