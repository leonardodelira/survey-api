import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IHashCompare } from '../../protocols/criptography/hash-compare';
import { ITokenGenerator } from '../../protocols/criptography/token-generator';
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashCompare: IHashCompare;
  private readonly tokenGenerator: ITokenGenerator;
  private readonly updateAccessTokenGenerator: IUpdateAccessTokenRepository;

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository, hashCompare: IHashCompare, tokenGenerator: ITokenGenerator, updateAccessToken: IUpdateAccessTokenRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenGenerator = updateAccessToken;
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);

    if (account) {
      const passwordCorrect = await this.hashCompare.compare(authentication.password, account.password);

      if (passwordCorrect) {
        const accessToken = await this.tokenGenerator.generate(account.id);
        await this.updateAccessTokenGenerator.updateAccessToken(account.id, accessToken);
        return accessToken;
      }
    }

    return null;
  }
}
