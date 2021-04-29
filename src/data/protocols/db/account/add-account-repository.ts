import { IAddAccountParams } from '../../../../domain/usecases/account/add-account';
import { IAccountModel } from '../../../usercases/account/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(account: IAddAccountParams): Promise<IAccountModel>;
}
