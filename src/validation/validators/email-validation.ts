import { IValidation } from '@/presentation/protocols/validation';
import { IEmailValidator } from '@/validation/protocols/email-validator';
import { InvalidParamError } from '@/presentation/errors';

export class EmailValidation implements IValidation {
  constructor(private readonly fieldName: string, private readonly emailValidator: IEmailValidator) { }

  validate(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isValid) {
      return new InvalidParamError(input[this.fieldName]);
    }
  }
}
