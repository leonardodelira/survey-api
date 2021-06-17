import { IAuthentication } from '@/domain/usecases/account/authentication';

export const mockAuthenticationStub = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthentication.Params): Promise<IAuthentication.Result> {
      return await Promise.resolve({
        accessToken: 'any_token',
        name: 'any_name',
      });
    }
  }
  return new AuthenticationStub();
};
