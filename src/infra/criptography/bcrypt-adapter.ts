import bcrypt from 'bcrypt';
import { IEncrypter } from '../../data/protocols/encrypter';

export class BcryptAdapter implements IEncrypter {
  private readonly _salt: number;

  constructor(salt: number) {
    this._salt = salt;
  }

  async encrypt(value: string): Promise<string> {
    await bcrypt.hash(value, this._salt);
    return await new Promise((resolve) => resolve(''));
  }
}
