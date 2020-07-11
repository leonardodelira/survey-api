import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IAccountModel } from '../../../domain/models/account';
import { DbAuthentication } from './db-authentication';
import { IAuthenticationModel } from '../../../domain/usecases/authentication';
import { IHashCompare } from '../../protocols/criptography/hash-compare';
import { ITokenGenerator } from '../../protocols/criptography/token-generator';
import { IUpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository';

const makeFakeAccount = (): IAccountModel => ({
  id: 1,
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password',
});

const makeFakeAccountAuthentication = (): IAuthenticationModel => ({
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

const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return await new Promise((resolve) => resolve(true));
    }
  }
  return new HashCompareStub();
};

const makeTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(value: string): Promise<string> {
      return await new Promise((resolve) => resolve('any_token'));
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenStub = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenStub implements IUpdateAccessTokenRepository {
    async update(id: number, token: string): Promise<void> {
      await new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  tokenGeneratorStub: ITokenGenerator;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountEmailRepositoryStub();
  const hashCompareStub = makeHashCompare();
  const tokenGeneratorStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub, updateAccessTokenRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub,
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

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null);
    const accessToken = await sut.auth(makeFakeAccount());
    expect(accessToken).toBeNull();
  });

  test('Should call HashCompare with correct password', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');
    await sut.auth(makeFakeAccountAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.auth(makeFakeAccount());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve) => resolve(false)));
    const comparedPassword = await sut.auth(makeFakeAccount());
    expect(comparedPassword).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(makeFakeAccount());
    expect(generateSpy).toHaveBeenCalledWith(1);
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.auth(makeFakeAccount());
    await expect(promise).rejects.toThrow();
  });

  test('Should return access token if TokenGenerator success', async () => {
    const { sut } = makeSut();
    const accessToken = await sut.auth(makeFakeAccount());
    expect(accessToken).toBe('any_token');
  });

  test('Should call UpdateAcesssTokenRepository with correct token', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update');
    await sut.auth(makeFakeAccountAuthentication());
    expect(updateSpy).toHaveBeenCalledWith(1, 'any_token');
  });
});
