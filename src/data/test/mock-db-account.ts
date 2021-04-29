import { IAccountModel } from '../../domain/models/account';
import { mockAccountModel } from '../../domain/test';
import { IAddAccountParams } from '../../domain/usecases/account/add-account';
import { IAddAccountRepository } from '../protocols/db/account/add-account-repository';
import { ILoadAccountByEmailRepository } from '../protocols/db/account/load-account-by-email-repository';
import { ILoadAccountByTokenRepository } from '../protocols/db/account/load-account-by-token-repository';
import { IUpdateAccessTokenRepository } from '../protocols/db/account/update-access-token-repository';

export const mockAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(account: IAddAccountParams): Promise<IAccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }

  return new AddAccountRepositoryStub();
};

export const mockLoadAccountEmailRepositoryStub = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<IAccountModel> {
      return await Promise.resolve(mockAccountModel());
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};


export const mockLoadAccountByTokenRepository = (): ILoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements ILoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<IAccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenStub = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenStub implements IUpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {
      await Promise.resolve(true);
    }
  }
  return new UpdateAccessTokenStub();
};