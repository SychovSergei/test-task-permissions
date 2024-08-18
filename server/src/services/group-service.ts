import { BaseService, getDetailNames, getDetailTypeOf } from "./base-service";
import { IMainEntity } from "../models/data.model";

export class GroupService extends BaseService<"groups"> {
  constructor() {
    super("groups");
  }

  async getDataItems(): Promise<IMainEntity<"groups">> {
    const detailsType = getDetailTypeOf(this.dataType);
    const detailsSource = this.dbService.getDataByType(detailsType);
    const detailNames = getDetailNames(detailsSource);
    return {
      mainDataType: this.dataType,
      mainData: this.items,
      details: {
        type: detailsType,
        dataTypeName: "Roles",
        dataNames: detailNames,
      },
    } as IMainEntity<"groups">;
  }
}
