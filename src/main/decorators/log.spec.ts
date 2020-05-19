import { LogControllerDecorator } from './log';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

describe('LogController Decorator', () => {
  test('Should call handle method', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          statusCode: 200,
          body: 'any_body'
        }
        return await new Promise(resolve => resolve(httpResponse))
      }
    }

    const controllerSub = new ControllerStub();
    const handleSpy = jest.spyOn(controllerSub, 'handle');
    const sut = new LogControllerDecorator(controllerSub);

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