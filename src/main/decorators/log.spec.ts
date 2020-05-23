import { LogControllerDecorator } from './log';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { serverError, ok } from '../../presentation/helpers/http-helpers';
import { ILogErrorRepository } from '../../data/protocols/log-error-repository';

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller,
  logErrorRepositoryStub: ILogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: 'any_body'
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub();
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: '123',
    passwordConfirmation: '123'
  }
});

const makeLogErrorRepository = (): ILogErrorRepository => {
  class LogErrorRepositoryStub implements ILogErrorRepository {
    async log(stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub();
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call handle method', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  })

  test('Should return the same result of the controller', async () => {
    const { sut } = makeSut();
    
    const httpReponse = await sut.handle(makeFakeRequest());
    expect(httpReponse).toEqual(ok('any_body'));
  })

  test('Should call LogErrorRepository if controller return a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();

    const fakeError = new Error();
    fakeError.stack = 'any_error';
    
    const error = serverError(fakeError);

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    );

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    
    await sut.handle(makeFakeRequest());
    
    expect(logSpy).toHaveBeenCalledWith('any_error');
  })
})