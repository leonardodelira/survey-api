import { IValidation } from '../../protocols/validation';
import { InvalidParamError } from '../../errors';

export class CompareFieldsValidation implements IValidation {
  constructor(private readonly fieldName: string, private readonly fieldToCompare: string) {}

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare);
    }
  }
}
