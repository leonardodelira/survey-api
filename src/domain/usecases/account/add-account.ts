import { IAccountModel } from '../../models/account';

export interface IAddAccountParams {
  name: string;
  email: string;
  password: string;
}

export interface IAddAccount {
  add(account: IAddAccountParams): Promise<IAccountModel>;
}
