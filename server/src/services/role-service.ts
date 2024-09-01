import { BaseService } from "./base-service";
import { RolesDto } from "../models/roles.dto";
import { RoleDtoFactory } from "../models/role-dto-factory";

export class RoleService extends BaseService<"roles"> {
  constructor() {
    super("roles");
  }
  async getData(): Promise<RolesDto> {
    return await RoleDtoFactory.create();
  }
}
