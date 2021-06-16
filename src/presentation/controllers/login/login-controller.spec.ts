import { LoginController } from './login-controller';
import { badRequest, serverError, unathorized } from '@/presentation/helpers/http/http-helpers';
import { MissingParamError } from '@/presentation/errors';
import { IAuthentication } from '@/domain/usecases/account/authentication';
import { IValidation } from '@/presentation/protocols/validation';
import { mockAuthenticationStub, mockValidation } from '@/presentation/test';

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

const mockRequest = (): LoginController.Request => ({
  email: 'email@email.com',
  password: '123',
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

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null));

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

    expect(httpResponse.body.accessToken).toBe('any_token');
    expect(httpResponse.body.name).toBe('any_name');
  });

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');

    const request = {
      name: 'any_name',
      email: 'any_email@test.com',
      password: '123',
      passwordConfirm: '123',
    };

    await sut.handle(request);
    expect(validateSpy).toHaveBeenCalledWith(request);
  });

  test('Should return badrequest when validate fails', async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'));

    const request = {
      name: 'any_name',
      email: 'any_email@test.com',
      password: '123',
      passwordConfirm: '123',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
  });
});
