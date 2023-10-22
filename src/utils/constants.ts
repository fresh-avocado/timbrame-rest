import { CookieSerializeOptions } from "@fastify/cookie";

export const COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  signed: true,
  sameSite: 'lax',
}