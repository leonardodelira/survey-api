import { RequiredFieldValidation } from './required-field-validation';
import { MissingParamError } from '../../errors';

describe('Required field validations', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('email');
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('email'));
  });

  test('Should not return a MissingParamError if validation success', () => {
    const sut = new RequiredFieldValidation('email');
    const error = sut.validate({ email: 'any_name' });
    expect(error).toBeFalsy();
  });
});
