import jwt from 'jsonwebtoken';
import { JwtAdapter } from './jwt-adapter';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return await new Promise((resolve) => resolve('any_access_token'));
  },

  async verify(token: string, secretOrPublicKey: string): Promise<string | object> {
    return await new Promise(resolve => resolve('any_token'))
  }
}));

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = new JwtAdapter('secret');
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.generate('any_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    test('Should return a token on sign success', async () => {
      const sut = new JwtAdapter('secret');
      const accessToken = await sut.generate('any_id');
      expect(accessToken).toBe('any_access_token');
    });

    test('Should throw if sign throws', async () => {
      const sut = new JwtAdapter('secret');
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.generate('any_id');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = new JwtAdapter('secret');
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
  })
});
