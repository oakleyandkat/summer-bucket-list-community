import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export function isValidPin(pin: string): boolean {
  return /^\d{4}$/.test(pin);
}

export function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= 30;
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, SALT_ROUNDS);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}
