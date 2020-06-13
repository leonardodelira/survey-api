import { ValidationComposite } from './validation-composite';
import { MissingParamError } from '../../errors';
import { IValidation } from './validation';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: IValidation[];
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
  const validationStubs = [makeValidationStub(), makeValidationStub()];
  const sut = new ValidationComposite(validationStubs);

  return {
    validationStubs,
    sut,
  };
};

describe('Validation Composite', () => {
  test('Should return an error if any validators fail', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('email'));
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('email'));
  });

  test('Should return the first error if more than one validators fail', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('email'));
    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new Error());
  });

  test('Should not return error if validators success', () => {
    const { sut } = makeSut();
    const error = sut.validate({ name: 'any_name' });

    expect(error).toBeFalsy();
  });
});
