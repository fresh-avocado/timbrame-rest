import { getModelForClass } from "@typegoose/typegoose";
import { Example } from "./Example.model";
import { User } from "./User.model";

export const ExampleModel = getModelForClass(Example)
export const UserModel = getModelForClass(User)