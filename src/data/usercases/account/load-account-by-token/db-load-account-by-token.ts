import { ILoadAccountByToken } from '../../../../domain/usecases/account/load-account-by-token';
import { IDecrypter } from '../../../protocols/criptography/decrypter';
import { ILoadAccountByTokenRepository } from '../../../protocols/db/account/load-account-by-token-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) { }

  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    const decryptedToken = await this.decrypter.decrypt(accessToken);

    if (decryptedToken) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);

      if (account) {
        return account
      }
    }

    return null;
  }
}