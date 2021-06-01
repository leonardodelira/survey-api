import { iAuthenticationModel } from '@/domain/models/authentication';
import { IAuthentication, IAuthenticationModel } from '@/domain/usecases/account/authentication';

export const mockAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthenticationModel): Promise<iAuthenticationModel> {
      return await Promise.resolve({
        accessToken: 'any_token',
        name: 'any_name',
      });
    }
  }
  return new AuthenticationStub();
};
