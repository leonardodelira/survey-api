import bcrypt from 'bcrypt';
import { IHasher } from '../../data/protocols/criptography/hasher';
import { IHashCompare } from '../../data/protocols/criptography/hash-compare';

export class BcryptAdapter implements IHasher, IHashCompare {
  private readonly _salt: number;

  constructor(salt: number) {
    this._salt = salt;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }

  async hashe(value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this._salt);
    return hashedValue;
  }
}
