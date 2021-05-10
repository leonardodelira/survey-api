import { CompareFieldsValidation } from './compare-fields-validation';
import { InvalidParamError } from '@/presentation/errors';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('password', 'confirm_password');
};

describe('Required field compare', () => {
  test('Should return a InvalidParamError if compare fails', () => {
    const sut = makeSut();
    const error = sut.validate({ password: 'any_pass', confirm_password: 'wrong_pass' });
    expect(error).toEqual(new InvalidParamError('confirm_password'));
  });

  test('Should not return a InvalidParamError if compare success', () => {
    const sut = makeSut();
    const error = sut.validate({ password: 'any_pass', confirm_password: 'any_pass' });
    expect(error).toBeFalsy();
  });
});
