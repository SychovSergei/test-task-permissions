import { IMainEntityMainData, IPermissionsData } from "./data.model";

export type TDataBase = {
  groups: IMainEntityMainData<"groups">;
  roles: IMainEntityMainData<"roles">;
  permissions: IPermissionsData;
};
