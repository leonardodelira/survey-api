import { IAddAccount, IAddAccountModel, IAccountModel, IAddAccountRepository, ILoadAccountByEmailRepository } from './db-add-account-protocols';
import { IHasher } from '../../../protocols/criptography/hasher';

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: IHasher, private readonly accountRepository: IAddAccountRepository, private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,) { }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hasAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    if (hasAccount) return null;

    const hashedPassword = await this.encrypter.hashe(accountData.password);
    const account = await this.accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}