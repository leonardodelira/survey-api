import { LoginController } from './login'
import { HttpRequest } from '../../protocols';
import { badRequest } from '../../helpers/http-helpers';
import { MissingParamError } from '../../errors';

const makeSut = (): any => {
  const sut = new LoginController();
  return {
    sut
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const {sut} = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        password: '123'
      }
    }
    
    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 400 if no password is provided', async () => {
    const {sut} = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com'
      }
    }
    
    const httpReponse = await sut.handle(httpRequest);
    expect(httpReponse).toEqual(badRequest(new MissingParamError('password')));
  });
})