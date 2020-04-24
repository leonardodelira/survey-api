import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../errors';
import { IEmailValidator } from '../protocols/email-validator';
import { IAddAccount, IAddAccountModel } from '../../domain/usecases/add-account';
import { IAccountModel } from '../../domain/models/account';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

const makeAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    add(account: IAddAccountModel): IAccountModel {
      return {
        id: 1,
        name: 'name',
        email: 'name@email.com',
      };
    }
  }

  return new AddAccountStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'teste@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        email: 'teste@test.com',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirm is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        email: 'teste@test.com',
        password: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'));
  });

  test('Should return 400 if an email invalid is provided', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should return 400 if password confirmation fails', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '1234',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
  });

  test('Should return success when provided correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValid = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'test',
        email: 'valid_email@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    sut.handle(httpRequest);
    expect(isValid).toHaveBeenCalledWith('valid_email@test.com');
  });

  test('Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should call AddAcount with correct params', () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'test',
        email: 'valid_email@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'test',
      email: 'valid_email@test.com',
      password: '123',
    });
  });

  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
