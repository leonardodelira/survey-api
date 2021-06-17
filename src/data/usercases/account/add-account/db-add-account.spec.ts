import { DbAddAccount } from './db-add-account';
import { IAddAccountRepository } from './db-add-account-protocols';
import { IHasher } from '@/data/protocols/criptography/hasher';
import { mockAccountModel, mockAddAccountParams, throwError } from '@/domain/test';
import { mockAddAccountRepository, mockEncrypter } from '@/data/test';
import { ICheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository';

export const mockCheckAccountEmailRepositoryStub = (): ICheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub implements ICheckAccountByEmailRepository {
    async checkByEmail(email: string): Promise<ICheckAccountByEmailRepository.Result> {
      return await Promise.resolve(null);
    }
  }
  return new CheckAccountByEmailRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
  loadAccountEmailRepositoryStub: ICheckAccountByEmailRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = mockEncrypter();
  const addAccountRepositoryStub = mockAddAccountRepository();
  const loadAccountEmailRepositoryStub = mockCheckAccountEmailRepositoryStub();

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountEmailRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountEmailRepositoryStub,
  };
};

describe('DbAddAccount Usercase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'hashe');

    await sut.add(mockAddAccountParams());
    expect(encryptSpy).toHaveBeenCalledWith('password_valid');
  });

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'hashe').mockImplementationOnce(throwError);

    const promisse = sut.add(mockAddAccountParams());
    await expect(promisse).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(mockAddAccountParams());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'name_valid',
      email: 'email_valid',
      password: 'hashed_password',
    });
  });

  test('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError);

    const promisse = sut.add(mockAddAccountParams());
    await expect(promisse).rejects.toThrow();
  });

  test('Should return AccountModel', async () => {
    const { sut } = makeSut();

    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual({
      id: '1',
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password',
    });
  });

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountEmailRepositoryStub, 'checkByEmail').mockResolvedValueOnce(Promise.resolve(true));
    const account = await sut.add(mockAddAccountParams());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountEmailRepositoryStub, 'checkByEmail');
    await sut.add(mockAccountModel());
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
