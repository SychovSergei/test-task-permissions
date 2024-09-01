import axios from "axios";

import { GroupsDto } from "./groups.dto";
import { DtoUtils } from "./dto-utils";
import { IMainEntityMainData } from "./data.model";
import { jsonServerConfig } from "../config/config";

export class GroupDtoFactory {
  static async create(): Promise<GroupsDto> {
    const groups = await axios.get<IMainEntityMainData<"groups">[]>(
      "/api-json/groups",
      jsonServerConfig,
    );
    const detailsType = DtoUtils.getDependentDetailTypeOf("groups");
    const roles = await axios.get<IMainEntityMainData<"roles">[]>(
      "/api-json/roles",
      jsonServerConfig,
    );
    const detailNames = DtoUtils.getDetailNames(roles.data);
    return {
      mainDataType: "groups",
      mainData: groups.data,
      details: {
        type: detailsType,
        dataTypeName: "Roles",
        dataNames: detailNames,
      },
    };
  }
}
