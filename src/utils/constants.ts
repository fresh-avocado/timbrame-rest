import { CookieSerializeOptions } from "@fastify/cookie";

export const COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
  domain: '127.0.0.1',
  path: '/'
}

export const SALT_ROUNDS = 10;

export const SESSION_MAX_AGE = 300; // 5 minutes
