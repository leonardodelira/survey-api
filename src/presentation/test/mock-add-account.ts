import { IAddAccount } from '@/domain/usecases/account/add-account';

export const mockAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: IAddAccount.Params): Promise<IAddAccount.Result> {
      const newAccount = {
        id: '1',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'hashed',
      };
      return await Promise.resolve(newAccount);
    }
  }

  return new AddAccountStub();
};
