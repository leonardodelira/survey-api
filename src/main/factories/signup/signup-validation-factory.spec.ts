import { ValidationComposite, RequiredFieldValidation, CompareFieldsValidation, EmailValidation } from '../../../presentation/helpers/validators';
import { makeSignUpValidation } from './signup-validation';
import { IValidation } from '../../../presentation/protocols/validation';
import { IEmailValidator } from '../../../presentation/protocols/email-validator';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidator implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidator();
};

describe('Signup Validation Factorie', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirm']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirm'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
