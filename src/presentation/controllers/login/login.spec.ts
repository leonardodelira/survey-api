import { LoginController } from './login'
import { HttpRequest } from '../../protocols';
import { badRequest, serverError, unathorized, ok } from '../../helpers/http-helpers';
import { MissingParamError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';
import { IAuthentication } from '../../../domain/usecases/authentication';

interface SutTypes {
  sut: LoginController,
  emailValidatorStub: IEmailValidator,
  authenticationStub: IAuthentication
}

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'));
    }
  }
  return new AuthenticationStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const authenticationStub = makeAuthenticationStub();
  const sut = new LoginController(emailValidatorStub, authenticationStub);

  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'email@email.com',
    password: '123'
  }
})

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        password: '123'
      }
    }
    
    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com'
      }
    }
    
    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();
    
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    
    await sut.handle(makeFakeRequest());
    expect(isValidSpy).toHaveBeenCalledWith('email@email.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());
    expect(authSpy).toHaveBeenCalledWith('email@email.com', '123');
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unathorized())
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    })

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()))
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({acessToken: 'any_token'}))
  });
})