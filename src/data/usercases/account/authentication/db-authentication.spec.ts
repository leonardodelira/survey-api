import { ILoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository';
import { DbAuthentication } from './db-authentication';
import { IAuthenticationModel } from '@/domain/usecases/account/authentication';
import { IHashCompare } from '@/data/protocols/criptography/hash-compare';
import { ITokenGenerator } from '@/data/protocols/criptography/token-generator';
import { IUpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository';
import { mockAccountModel, throwError } from '@/domain/test';
import { mockHashCompare, mockTokenGenerator, mockLoadAccountEmailRepositoryStub, mockUpdateAccessTokenStub } from '@/data/test';

const makeFakeAccountAuthentication = (): IAuthenticationModel => ({
  email: 'any_email@email.com',
  password: 'any_password',
});

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  hashCompareStub: IHashCompare;
  tokenGeneratorStub: ITokenGenerator;
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountEmailRepositoryStub();
  const hashCompareStub = mockHashCompare();
  const tokenGeneratorStub = mockTokenGenerator();
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenStub();
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
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
    await sut.auth(mockAccountModel());
    expect(loadSpy).toHaveBeenCalledWith('any_email@email.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAccountModel());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if LoadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);
    const accessToken = await sut.auth(mockAccountModel());
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
    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAccountModel());
    await expect(promise).rejects.toThrow();
  });

  test('Should return null if HashCompare return false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const comparedPassword = await sut.auth(mockAccountModel());
    expect(comparedPassword).toBeNull();
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(mockAccountModel());
    expect(generateSpy).toHaveBeenCalledWith('1');
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockImplementationOnce(throwError);
    const promise = sut.auth(mockAccountModel());
    await expect(promise).rejects.toThrow();
  });

  test('Should return access token if TokenGenerator success', async () => {
    const { sut } = makeSut();
    const response = await sut.auth(mockAccountModel());
    expect(response).toEqual({
      accessToken: 'any_token',
      name: 'any_name',
    });
  });

  test('Should call UpdateAcesssTokenRepository with correct token', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
    await sut.auth(makeFakeAccountAuthentication());
    expect(updateSpy).toHaveBeenCalledWith('1', 'any_token');
  });
});
