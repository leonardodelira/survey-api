import { IAddAccount, IAddAccountRepository, ILoadAccountByEmailRepository } from './db-add-account-protocols';
import { IHasher } from '@/data/protocols/criptography/hasher';
import { ICheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository';

export class DbAddAccount implements IAddAccount {
  constructor(private readonly encrypter: IHasher, private readonly accountRepository: IAddAccountRepository, private readonly checkAccountByEmailRepository: ICheckAccountByEmailRepository) {}

  async add(accountData: IAddAccount.Params): Promise<IAddAccount.Result> {
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email);
    if (hasAccount) return null;

    const hashedPassword = await this.encrypter.hashe(accountData.password);
    const account = await this.accountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));
    return account;
  }
}
