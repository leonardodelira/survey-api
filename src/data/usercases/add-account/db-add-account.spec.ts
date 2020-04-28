import { DbAddAccount } from './db-add-account';
import { IEncrypter, IAddAccountModel, IAddAccountRepository } from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
  addAccountRepositoryStub: IAddAccountRepository;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterSub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new EncrypterSub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(account: IAddAccountModel): Promise<IAddAccountModel> {
      const fakeAccount = {
        id: 1,
        name: 'name',
        email: 'email',
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

  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};

describe('DbAddAccount Usercase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'name_valid',
      email: 'email_valid',
      password: 'password_valid',
    };

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('password_valid');
  });

  test('Should throws if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const accountData = {
      name: 'name_valid',
      email: 'email_valid',
      password: 'password_valid',
    };

    const promisse = sut.add(accountData);
    await expect(promisse).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = {
      name: 'name_valid',
      email: 'email_valid',
      password: 'valid_password',
    };

    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name_valid',
      email: 'email_valid',
      password: 'hashed_password',
    });
  });
});
