import { makeLoginValidation } from './login-validation';
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite';
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation';
import { IValidation } from '../../../presentation/protocols/validation';
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation';
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

describe('Login Validation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: IValidation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
