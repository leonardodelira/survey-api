import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;

  constructor(loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository) {
    this.loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryStub;
  }

  async auth(authentication: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepositoryStub.load(authentication.email);
    return null;
  }
}
