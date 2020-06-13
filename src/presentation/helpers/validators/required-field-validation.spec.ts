import { RequiredFieldValidation } from './required-field-validation';
import { MissingParamError } from '../../errors';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('email');
};

describe('Required field validations', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('email'));
  });

  test('Should not return a MissingParamError if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({ email: 'any_name' });
    expect(error).toBeFalsy();
  });
});
