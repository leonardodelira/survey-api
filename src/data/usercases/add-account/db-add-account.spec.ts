import { DbAddAccount } from './db-add-account';
import { IEncrypter } from './db-add-account-protocols';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: IEncrypter;
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterSub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('hashed_password'));
    }
  }

  return new EncrypterSub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub,
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
});
