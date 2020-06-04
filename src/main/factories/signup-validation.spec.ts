import { makeSignUpValidation } from './signup-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../presentation/helpers/validators/validation';
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation';
import { EmailValidation } from '../../presentation/helpers/validators/email-validation';
import { IEmailValidator } from '../../presentation/protocols/email-validator';

jest.mock('../../presentation/helpers/validators/validation-composite');

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
