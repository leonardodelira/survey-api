import { IAddAccount, IAddAccountModel } from '../../../domain/usecases/add-account';
import { IAccountModel } from '../../../domain/models/account';
import { IEncrypter } from '../../protocols/IEncrypter';

export class DbAddAccount implements IAddAccount {
  private readonly _encrypter: IEncrypter;

  constructor(encrypter: IEncrypter) {
    this._encrypter = encrypter;
  }

  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this._encrypter.encrypt(account.password);
    return await new Promise((resolve) => resolve(null));
  }
}
