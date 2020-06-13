import { ValidationComposite } from './validation-composite';
import { MissingParamError } from '../../errors';
import { IValidation } from './validation';

describe('Validation Composite', () => {
  test('Should return an error if any validators fail', () => {
    class ValidationStub implements IValidation {
      validate(input: any): Error {
        return new MissingParamError('email');
      }
    }
    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('email'));
  });
});
