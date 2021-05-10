import { IValidation } from '@/presentation/protocols/validation';
import { InvalidParamError } from '@/presentation/errors';

export class CompareFieldsValidation implements IValidation {
  constructor(private readonly fieldName: string, private readonly fieldToCompare: string) { }

  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompare]) {
      return new InvalidParamError(this.fieldToCompare);
    }
  }
}
