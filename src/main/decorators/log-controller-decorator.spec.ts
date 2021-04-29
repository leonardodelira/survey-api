import { LogControllerDecorator } from './log-controller-decorator';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { serverError, ok } from '../../presentation/helpers/http/http-helpers';
import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import { mockLogErrorRepository } from '../../data/test';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: ILogErrorRepository;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: 'any_body',
      };
      return await Promise.resolve(httpResponse);
    }
  }

  return new ControllerStub();
};

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: '123',
    passwordConfirmation: '123',
  },
});

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call handle method', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();

    const httpReponse = await sut.handle(makeFakeRequest());
    expect(httpReponse).toEqual(ok('any_body'));
  });

  test('Should call LogErrorRepository if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_error';

    const error = serverError(fakeError);

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error));

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');

    await sut.handle(makeFakeRequest());

    expect(logSpy).toHaveBeenCalledWith('any_error');
  });
});
