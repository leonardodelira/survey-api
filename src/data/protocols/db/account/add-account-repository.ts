import { IAddAccount } from '../../../usercases/account/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(account: IAddAccount.Params): Promise<IAddAccountRepository.Result>;
}

export namespace IAddAccountRepository {
  export type Params = IAddAccount.Params;
  export type Result = IAddAccount.Result;
}
