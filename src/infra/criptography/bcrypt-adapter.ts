import bcrypt from 'bcrypt';
import { IEncrypter } from '../../data/protocols/criptography/encrypter';

export class BcryptAdapter implements IEncrypter {
  private readonly _salt: number;

  constructor(salt: number) {
    this._salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt);
    return hashedValue;
  }
}
