import { DbAddAccount } from './db-add-account';
import { IEncrypter } from '../../protocols/IEncrypter';

describe('DbAddAccount Usercase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterSub implements IEncrypter {
      async encrypt(value: string): Promise<string> {
        return await new Promise((resolve) => resolve('hashed_password'));
      }
    }

    const encrypterStub = new EncrypterSub();
    const sut = new DbAddAccount(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');

    const accountData = {
      name: 'name_valid',
      email: 'email_valid',
      password: 'password_valid',
    };

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('password_valid');
  });
});
