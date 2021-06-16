import { IAccountModel } from '@/domain/models/account';

export interface IAddAccount {
  add(account: IAddAccount.Params): Promise<IAddAccount.Result>;
}

export namespace IAddAccount {
  export type Params = {
    name: string;
    email: string;
    password: string;
  };

  export type Result = IAccountModel;
}
