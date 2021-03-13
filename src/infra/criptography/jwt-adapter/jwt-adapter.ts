import { ITokenGenerator } from '../../../data/protocols/criptography/token-generator';
import { IDecrypter } from '../../../data/protocols/criptography/decrypter';

import jwt from 'jsonwebtoken';

export class JwtAdapter implements ITokenGenerator, IDecrypter {
  private readonly secret;

  constructor(secret: string) {
    this.secret = secret;
  }

  async generate(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);
    return accessToken;
  }

  async decrypt(value: string): Promise<string> {
    await jwt.verify(value, this.secret)
    return await new Promise(resolve => resolve(null))
  }
}
