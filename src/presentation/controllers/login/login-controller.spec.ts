import { LoginController } from './login-controller';
import { HttpRequest } from '../../protocols';
import { badRequest, serverError, unathorized, ok } from '../../helpers/http/http-helpers';
import { MissingParamError } from '../../errors';
import { IAuthentication } from '../../../domain/usecases/account/authentication';
import { IValidation } from '../../protocols/validation';
import { mockAuthenticationStub, mockValidation } from '../../test';

interface SutTypes {
  sut: LoginController;
  validationStub: IValidation;
  authenticationStub: IAuthentication;
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthenticationStub();
  const validationStub = mockValidation();
  const sut = new LoginController(authenticationStub, validationStub);

  return {
    sut,
    validationStub,
    authenticationStub,
  };
};

const mockRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    password: '123',
  },
});

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(mockRequest());
    expect(authSpy).toHaveBeenCalledWith({ email: 'email@email.com', password: '123' });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(unathorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ acessToken: 'any_token' }));
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test('Should return badrequest when validate fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
