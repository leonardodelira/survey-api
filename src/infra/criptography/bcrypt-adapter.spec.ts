import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return await new Promise((resolve) => resolve('hash'));
  },

  async compare(): Promise<boolean> {
    return await new Promise((resolve) => resolve(true));
  },
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.hashe('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a value hashed', async () => {
    const sut = makeSut();
    const hashedValue = await sut.hashe('any_value');
    expect(hashedValue).toBe('hash');
  });

  test('Should return throw if error', async () => {
    const sut = makeSut();

    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

    const hashedValue = sut.hashe('any_value');
    await expect(hashedValue).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return success if compare success', async () => {
    const sut = makeSut();
    const isValid = await sut.compare('any_value', 'any_hash');
    expect(isValid).toBeTruthy();
  });
});
