import { IAddAccountModel } from '../../domain/usecases/add-account';
import { IAccountModel } from '../usercases/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(account: IAddAccountModel): Promise<IAccountModel>;
}
