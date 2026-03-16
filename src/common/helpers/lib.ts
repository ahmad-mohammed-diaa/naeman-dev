import * as bcrypt from 'bcrypt';
import { AppUnauthorizedException } from '@/common/exceptions/app.exception';

export const SALT = 10;

export const hashedPassword = (password: string) => bcrypt.hash(password, SALT);

export const DEFAULT_PASSWORD = () =>
  hashedPassword(process.env.DEFAULT_PASSWORD || 'Naeman@123');

export const comparePassword = async (plain: string, hash: string) => {
  const ok = await bcrypt.compare(plain, hash);
  if (!ok) throw new AppUnauthorizedException('AUTH_INVALID_CREDENTIALS');
};

export const OmitFields = <T, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, Exclude<K, 'translation'>> => {
  if (keys.length <= 0) return obj;
  const result = { ...obj };
  for (const key of keys) delete result[key];
  return result;
};

export const getDayRange = (date?: string) => {
  const day = date ? new Date(date) : new Date();
  const start = new Date(day);
  const end = new Date(day);
  start.setUTCHours(0, 0, 0, 0);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};
