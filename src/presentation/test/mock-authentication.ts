import { IAuthentication, IAuthenticationModel } from '../../domain/usecases/account/authentication';

export const mockAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthenticationModel): Promise<string> {
      return await Promise.resolve('any_token');
    }
  }
  return new AuthenticationStub();
};