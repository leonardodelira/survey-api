import { SignUpController } from '@/presentation/controllers/signup/signup-controller';
import { Controller } from '@/presentation/protocols';
import { makeSignUpValidation } from './signup-validation-factory';
import { makeDbAuthentication } from '@/main/factories/usecases/authentication/db-authentication-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory';

export const makeSignUpController = (): Controller => {
  const signUpController = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(signUpController);
};
