import { IAccountModel } from '@/domain/models/account';

export interface ILoadAccountByToken {
  load(accessToken: string, role?: string): Promise<ILoadAccountByToken.Result>;
}

export namespace ILoadAccountByToken {
  export type Result = IAccountModel;
}
