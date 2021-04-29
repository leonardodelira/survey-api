import { IAccountModel } from '../models/account';
import { IAddAccountParams } from '../usecases/account/add-account';

export const mockAccountModel = (): IAccountModel => ({
  id: '1',
  name: 'any_name',
  email: 'any_email@email.com',
  password: 'hashed_password',
});

export const mockAddAccountParams = (): IAddAccountParams => ({
  name: 'name_valid',
  email: 'email_valid',
  password: 'password_valid',
});