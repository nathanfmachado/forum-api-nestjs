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

  async compare(value: string, hash: string, salt: string): Promise<boolean> {
    const hashedValue = await this.generateHashWithSalt(value, salt);
    return hash === hashedValue;
  }
}
