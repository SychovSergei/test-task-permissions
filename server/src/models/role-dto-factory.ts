import axios from "axios";

import { RolesDto } from "./roles.dto";
import { DtoUtils } from "./dto-utils";
import { IMainEntityMainData, IPermissionsData } from "./data.model";
import { jsonServerConfig } from "../config/config";

export class RoleDtoFactory {
  static async create(): Promise<RolesDto> {
    const roles = await axios.get<IMainEntityMainData<"roles">[]>(
      `/api-json/roles`,
      jsonServerConfig,
    );
    const detailsType = DtoUtils.getDependentDetailTypeOf("roles");
    const permissions = await axios.get<IPermissionsData[]>(
      `/api-json/${detailsType}`,
      jsonServerConfig,
    );
    const detailNames = DtoUtils.getDetailNames(permissions.data);
    return {
      mainDataType: "roles",
      mainData: roles.data,
      details: {
        type: detailsType,
        dataTypeName: "Permissions",
        dataNames: detailNames,
      },
    };
  }
}
