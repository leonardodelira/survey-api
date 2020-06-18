import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { IAccountModel } from '../../../domain/models/account';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
      async load(email: string): Promise<IAccountModel> {
        const account: IAccountModel = {
          id: 1,
          name: 'any_name',
          email: 'any_email',
          password: 'any_password',
        };
        return await new Promise((resolve) => resolve(account));
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({
      email: 'any_email@email.com',
      password: 'any_password@password.com',
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
