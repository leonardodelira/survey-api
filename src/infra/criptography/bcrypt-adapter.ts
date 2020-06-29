import bcrypt from 'bcrypt';
import { IHasher } from '../../data/protocols/criptography/hasher';

export class BcryptAdapter implements IHasher {
  private readonly _salt: number;

  constructor(salt: number) {
    this._salt = salt;
  }

  async hashe(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt);
    return hashedValue;
  }
}
