import { IAddAccount, IAddAccountModel, IAccountModel, IAddAccountRepository } from './db-add-account-protocols';
import { IHasher } from '../../protocols/criptography/hasher';

export class DbAddAccount implements IAddAccount {
  private readonly _encrypter: IHasher;
  private readonly _accountRepository: IAddAccountRepository;

  constructor(encrypter: IHasher, accountRepository: IAddAccountRepository) {
    this._encrypter = encrypter;
    this._accountRepository = accountRepository;
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this._encrypter.hashe(accountData.password);
    const account = await this._accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}
