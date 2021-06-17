import { IAccountModel } from '../../../../domain/models/account';

export interface ILoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<ILoadAccountByEmailRepository.Result>;
}

export namespace ILoadAccountByEmailRepository {
  export type Result = IAccountModel;
}
