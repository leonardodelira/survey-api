import { ILoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';
import { IDecrypter } from '@/data/protocols/criptography/decrypter';
import { ILoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(private readonly decrypter: IDecrypter, private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository) {}

  async load(accessToken: string, role?: string): Promise<ILoadAccountByToken.Result> {
    let token: string;
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }

    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role);

      if (account) {
        return account;
      }
    }

    return null;
  }
}
