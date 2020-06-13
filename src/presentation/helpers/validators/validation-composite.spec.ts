import { ValidationComposite } from './validation-composite';
import { MissingParamError } from '../../errors';
import { IValidation } from './validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStub: IValidation;
}

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  const sut = new ValidationComposite([validationStub]);

  return {
    validationStub,
    sut,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validators fail', () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('email'));
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('email'));
  });
});
