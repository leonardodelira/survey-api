import { IAddAccountRepository } from '@/data/protocols/db/account/add-account-repository';

export const mockAccountModel = (): IAddAccountRepository.Result => ({
  id: '1',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password',
});

export const mockAddAccountParams = (): IAddAccountRepository.Params => ({
  name: 'name_valid',
  email: 'email_valid',
  password: 'password_valid',
});
