import { IAddAccount, IAddAccountModel, IAccountModel, IEncrypter } from './db-add-account-protocols';

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
