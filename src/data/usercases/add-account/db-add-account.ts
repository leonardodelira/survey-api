import { IAddAccount, IAddAccountModel, IAccountModel, IAddAccountRepository } from './db-add-account-protocols';
import { IEncrypter } from '../../protocols/criptography/encrypter';

export class DbAddAccount implements IAddAccount {
  private readonly _encrypter: IEncrypter;
  private readonly _accountRepository: IAddAccountRepository;

  constructor(encrypter: IEncrypter, accountRepository: IAddAccountRepository) {
    this._encrypter = encrypter;
    this._accountRepository = accountRepository;
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this._encrypter.encrypt(accountData.password);
    const account = await this._accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}
