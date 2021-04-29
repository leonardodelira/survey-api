import { IDecrypter } from '../protocols/criptography/decrypter';
import { IHashCompare } from '../protocols/criptography/hash-compare';
import { IHasher } from '../protocols/criptography/hasher';
import { ITokenGenerator } from '../protocols/criptography/token-generator';

export const mockEncrypter = (): IHasher => {
  class EncrypterSub implements IHasher {
    async hashe(value: string): Promise<string> {
      return await Promise.resolve('hashed_password');
    }
  }

  return new EncrypterSub();
};

export const mockDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<string> {
      return await Promise.resolve('any_token')
    }
  }

  return new DecrypterStub();
}

export const mockHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true);
    }
  }

  return new HashCompareStub();
};

export const mockTokenGenerator = (): ITokenGenerator => {
  class TokenGeneratorStub implements ITokenGenerator {
    async generate(value: string): Promise<string> {
      return await Promise.resolve('any_token');
    }
  }
  return new TokenGeneratorStub();
};