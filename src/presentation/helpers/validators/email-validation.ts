import { IValidation } from './validation';
import { IEmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors';

export class EmailValidation implements IValidation {
  private readonly emailValidator: IEmailValidator;
  private readonly fieldName: string;

  constructor(fieldName: string, emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator;
    this.fieldName = fieldName;
  }

  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(input[this.fieldName]);
    }
  }
}
