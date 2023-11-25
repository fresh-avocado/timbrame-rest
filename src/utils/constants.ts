import { CookieSerializeOptions } from "@fastify/cookie";
import envService from "src/services/envService";

export const SESSION_MAX_AGE = 300; // 5 minutes

export const COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: envService.isProd(),
  signed: true,
  sameSite: 'lax',
  maxAge: SESSION_MAX_AGE,
  domain: envService.isProd() ? '.gabrielspranger.com' : '0.0.0.0',
  path: '/'
}

export const SALT_ROUNDS = 10;

