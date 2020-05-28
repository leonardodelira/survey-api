import { SignUpController } from './signup';
import { MissingParamError, InvalidParamError, ServerError } from '../../errors';
import { IEmailValidator } from '../../protocols/email-validator';
import { IAddAccount, IAddAccountModel } from '../../../domain/usecases/add-account';
import { IAccountModel } from '../../../domain/models/account';
import { ok, serverError, badRequest } from '../../helpers/http-helpers';
import { IValidation } from '../../helpers/validators/validation';

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: IEmailValidator;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
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
    async add(account: IAddAccountModel): Promise<IAccountModel> {
      const newAccount = {
        id: 1,
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed',
      };
      return await new Promise((resolve) => resolve(newAccount));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(emailValidatorStub, addAccountStub, validationStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'teste@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        email: 'teste@test.com',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should return 400 if no passwordConfirm is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'test',
        email: 'teste@test.com',
        password: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirm')));
  });

  test('Should return 400 if an email invalid is provided', async () => {
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

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '1234',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirm')));
  });

  test('Should return success when provided correct email', async () => {
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

    await sut.handle(httpRequest);
    expect(isValid).toHaveBeenCalledWith('valid_email@test.com');
  });

  test('Should return 500 if EmailValidator throws', async () => {
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

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should call AddAcount with correct params', async () => {
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

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'test',
      email: 'valid_email@test.com',
      password: '123',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()));
    });

    const httpRequest = {
      body: {
        name: 'test',
        email: 'invalid@test.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 200 when addAccount work', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: '123',
        passwordConfirm: '123',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      ok({
        id: 1,
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed',
      })
    );
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
