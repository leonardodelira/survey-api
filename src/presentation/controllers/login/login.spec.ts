import { LoginController } from './login'
import { HttpRequest } from '../../protocols';
import { badRequest } from '../../helpers/http-helpers';
import { MissingParamError, InvalidParamError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';

interface SutTypes {
  sut: LoginController,
  emailValidatorStub: IEmailValidator
}

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub();
  const sut = new LoginController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'emaill@email.com',
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
    expect(isValidSpy).toHaveBeenCalledWith('emaill@email.com');
  });

  test('Should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut();
    
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  });
})