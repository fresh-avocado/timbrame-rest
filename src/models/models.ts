import { getModelForClass } from "@typegoose/typegoose";
import { Example } from "./Example.model";
import { User } from "./User.model";
import { Request } from "./Request.model";

export const ExampleModel = getModelForClass(Example)
export const UserModel = getModelForClass(User)
export const RequestModel = getModelForClass(Request)