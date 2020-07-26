import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '../../errors';
import { IAddAccount, IAddAccountModel } from '../../../domain/usecases/add-account';
import { IAccountModel } from '../../../domain/models/account';
import { ok, serverError, badRequest } from '../../helpers/http/http-helpers';
import { IValidation } from '../../protocols/validation';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

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
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

describe('SignUp Controller', () => {
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
