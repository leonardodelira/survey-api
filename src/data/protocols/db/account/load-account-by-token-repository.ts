import { ILoadAccountByToken } from '@/domain/usecases/account/load-account-by-token';

export interface ILoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<ILoadAccountByTokenRepository.Result>;
}

export namespace ILoadAccountByTokenRepository {
  export type Result = ILoadAccountByToken.Result;
}
