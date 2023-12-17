import { Injectable } from '@nestjs/common';
import { hash, genSalt } from 'bcryptjs';

@Injectable()
export class CryptoService {
  constructor() {}

  async generateHashWithSalt(value: string, salt: string): Promise<string> {
    return hash(value, salt);
  }

  async generateRandomSalt(): Promise<string> {
    return genSalt(8);
  }
}
