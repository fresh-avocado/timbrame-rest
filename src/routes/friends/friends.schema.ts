import { Static, Type } from '@sinclair/typebox'

export const FriendsSchema = Type.Object({
  username: Type.String({ minLength: 4, maxLength: 64 })
})

export type FriendsType = Static<typeof FriendsSchema>

export const RequestSchema = Type.Object({
  from: Type.String({ minLength: 4, maxLength: 64 }),
  to: Type.String({ minLength: 4, maxLength: 64 })
})

export type RequestType = Static<typeof RequestSchema>
