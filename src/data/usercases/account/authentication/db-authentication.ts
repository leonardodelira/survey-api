import { IAuthentication, IAuthenticationModel } from '@/domain/usecases/account/authentication';
import { ILoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { IHashCompare } from '@/data/protocols/criptography/hash-compare';
import { ITokenGenerator } from '@/data/protocols/criptography/token-generator';
import { IUpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashCompare: IHashCompare,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly updateAccessToken: IUpdateAccessTokenRepository
  ) { }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);

    if (account) {
      const passwordCorrect = await this.hashCompare.compare(authentication.password, account.password);

      if (passwordCorrect) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessToken.updateAccessToken(account.id, accessToken);
        return accessToken;
      }
    }

    return null;
  }
}
