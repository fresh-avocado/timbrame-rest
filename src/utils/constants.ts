import { CookieSerializeOptions } from "@fastify/cookie";

export const SESSION_MAX_AGE = 300; // 5 minutes

export const COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE,
  domain: '127.0.0.1',
  path: '/'
}

export const SALT_ROUNDS = 10;

