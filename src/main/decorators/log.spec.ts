import { LogControllerDecorator } from './log';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: 'any_body'
      }
      return await new Promise(resolve => resolve(httpResponse))
    }
  }

  const controllerStub = new ControllerStub();
  const sut = new LogControllerDecorator(controllerStub);

  return {
    sut,
    controllerStub
  }
}

describe('LogController Decorator', () => {
  test('Should call handle method', async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }
    
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  })
})