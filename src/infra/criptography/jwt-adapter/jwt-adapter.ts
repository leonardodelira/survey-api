import { ITokenGenerator } from '../../../data/protocols/criptography/token-generator';

import jwt from 'jsonwebtoken';

export class JwtAdapter implements ITokenGenerator {
  private readonly secret;

  constructor(secret: string) {
    this.secret = secret;
  }

  async generate(value: string): Promise<string> {
    await jwt.sign({ id: value }, this.secret);
    return await new Promise((resolve) => resolve(null));
  }
}
