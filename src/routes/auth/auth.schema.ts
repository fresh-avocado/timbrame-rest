import { Static, Type } from '@sinclair/typebox'

export const SignInSchema = Type.Object({
  username: Type.String({ minLength: 4, maxLength: 64 }),
  password: Type.String({ minLength: 8, maxLength: 64, pattern: '(hola)+' }),
})

export type SignInType = Static<typeof SignInSchema>

export const SignUpSchema = Type.Object({
  firstName: Type.String({ minLength: 2, maxLength: 50 }),
  lastName: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ format: 'email', maxLength: 100 }),
  username: Type.String({ maxLength: 100 }), // TODO: regex for usernames
  password: Type.String({ minLength: 8, maxLength: 64, pattern: '(hola)+' }),
})

export type SignUpType = Static<typeof SignUpSchema>
