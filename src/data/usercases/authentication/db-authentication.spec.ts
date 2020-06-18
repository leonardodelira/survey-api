import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { IAccountModel } from '../../../domain/models/account';
import { DbAuthentication } from './db-authentication';

const makeFakeAccount = (): IAccountModel => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'any_password',
});

const makeLoadAccountEmailRepositoryStub = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async load(email: string): Promise<IAccountModel> {
      const account = makeFakeAccount();
      return await new Promise((resolve) => resolve(account));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAccount());
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.auth(makeFakeAccount());
    await expect(promise).rejects.toThrow();
  });
});
