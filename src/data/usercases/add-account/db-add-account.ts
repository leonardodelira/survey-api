import { IAddAccount, IAddAccountModel, IAccountModel, IAddAccountRepository } from './db-add-account-protocols';
import { IHasher } from '../../protocols/criptography/hasher';

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: IHasher, private readonly accountRepository: IAddAccountRepository) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.encrypter.hashe(accountData.password);
    const account = await this.accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}
