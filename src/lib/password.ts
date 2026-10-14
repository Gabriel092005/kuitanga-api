import { compare, hash } from "bcryptjs";

const SALT_ROUNDS = 8;

const BCRYPT_PREFIX = /^\$2[aby]\$\d{2}\$/;

export function isHashed(hash: string): boolean {
  return BCRYPT_PREFIX.test(hash);
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  if (!passwordHash || !isHashed(passwordHash)) {
    return false;
  }

  return compare(password, passwordHash);
}