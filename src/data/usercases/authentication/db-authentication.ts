import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IHashCompare } from '../../protocols/criptography/hash-compare';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository;
  private readonly hashCompare: IHashCompare;

  constructor(loadAccountByEmailRepository: ILoadAccountByEmailRepository, hashCompare: IHashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email);

    if (account) {
      await this.hashCompare.compare(authentication.password, account.password);
    }

    return null;
  }
}
