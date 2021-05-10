import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '@/validation/validators';
import { IValidation } from '@/presentation/protocols/validation';
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
