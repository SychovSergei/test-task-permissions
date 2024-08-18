import { BaseService, getDetailTypeOf } from "./base-service";
import { IMainEntity, TDetailsDataNames } from "../models/data.model";

export class RoleService extends BaseService<"roles"> {
  constructor() {
    super("roles");
  }
  async getDataItems(): Promise<IMainEntity<"roles">> {
    const detailsType = getDetailTypeOf(this.dataType);
    const detailsSource = this.dbService.getDataByType(detailsType);
    const detailNames: TDetailsDataNames = {};
    detailsSource.forEach((item) => {
      detailNames[item.id] = item.name;
    });
    return {
      mainDataType: this.dataType,
      mainData: this.items,
      details: {
        type: detailsType,
        dataTypeName: "Permissions",
        dataNames: detailNames,
      },
    } as IMainEntity<"roles">;
  }
}
