import { SignUpController } from './signup-controller';
import { MissingParamError, ServerError } from '@/presentation/errors';
import { IAddAccount } from '@/presentation/../domain/usecases/account/add-account';
import { ok, serverError, badRequest } from '@/presentation/helpers/http/http-helpers';
import { IValidation } from '@/presentation/protocols/validation';
import { mockAuthenticationStub, mockValidation, mockAddAccount } from '@/presentation/test';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthenticationStub();
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub);

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

    const request = {
      name: 'test',
      email: 'valid_email@test.com',
      password: '123',
      passwordConfirm: '123',
    };

    await sut.handle(request);

    expect(addSpy).toHaveBeenCalledWith({
      name: 'test',
      email: 'valid_email@test.com',
      password: '123',
    });
  });

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error());
    });

    const request = {
      name: 'test',
      email: 'invalid@test.com',
      password: '123',
      passwordConfirm: '123',
    };

    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 200 when addAccount work', async () => {
    const { sut } = makeSut();
    const request = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: '123',
      passwordConfirm: '123',
    };

    const httpResponse = await sut.handle(request);

    expect(httpResponse).toEqual(
      ok({
        id: '1',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed',
      })
    );
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
