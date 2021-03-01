import { DbAddAccount } from './db-add-account';
import { IAddAccountModel, IAddAccountRepository, IAccountModel, ILoadAccountByEmailRepository } from './db-add-account-protocols';
import { IHasher } from '../../protocols/criptography/hasher';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: IHasher;
  addAccountRepositoryStub: IAddAccountRepository;
  loadAccountEmailRepositoryStub: ILoadAccountByEmailRepository;
}

const makeEncrypter = (): IHasher => {
  class EncrypterSub implements IHasher {
    async hashe(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new EncrypterSub();
};

const makeFakeAccount = (): IAccountModel => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password',
});


const makeLoadAccountEmailRepositoryStub = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<IAccountModel> {
      return await new Promise((resolve) => resolve(null));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      const fakeAccount = {
        id: 1,
        name: 'name_valid',
        email: 'email_valid',
        password: 'hashed_password',
      };
      return await new Promise((resolve) => resolve(fakeAccount));
    }
  }

  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountEmailRepositoryStub = makeLoadAccountEmailRepositoryStub();

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountEmailRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountEmailRepositoryStub
  };
};

const makeAccountFake = (): IAddAccountModel => ({
  name: 'name_valid',
  email: 'email_valid',
  password: 'password_valid',
});

describe('DbAddAccount Usercase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'hashe');

    await sut.add(makeAccountFake());
    expect(encryptSpy).toHaveBeenCalledWith('password_valid');
  });

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'hashe').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promisse = sut.add(makeAccountFake());
    await expect(promisse).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    await sut.add(makeAccountFake());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'name_valid',
      email: 'email_valid',
      password: 'hashed_password',
    });
  });

  test('Should throws if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const promisse = sut.add(makeAccountFake());
    await expect(promisse).rejects.toThrow();
  });

  test('Should return AccountModel', async () => {
    const { sut } = makeSut();

    const account = await sut.add(makeAccountFake());
    expect(account).toEqual({
      id: 1,
      name: 'name_valid',
      email: 'email_valid',
      password: 'hashed_password',
    });
  });

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(new Promise(resolve => resolve(makeFakeAccount())))
    const account = await sut.add(makeAccountFake());
    expect(account).toBeNull();
  });

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountEmailRepositoryStub, 'loadByEmail');
    await sut.add(makeFakeAccount());
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });
});
