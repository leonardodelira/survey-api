import { iAuthenticationModel } from '@/domain/models/authentication';

export interface IAuthenticationModel {
  email: string;
  password: string;
}

export interface IAuthentication {
  auth(authentication: IAuthenticationModel): Promise<iAuthenticationModel>;
}
