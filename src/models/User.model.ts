import { PropType, ReturnModelType, Ref, modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import isEmail from 'validator/lib/isEmail'
import { UserModel } from "./models";

type ThisModel = ReturnModelType<typeof User>;

@modelOptions({
  schemaOptions: {
    collection: 'Users',
    autoCreate: true,
    autoIndex: true,
  },
  options: {
    customName: 'Users',
  }
})
export class User {
  @prop({ type: Schema.Types.String, required: true })
  public name!: string

  @prop({ type: Schema.Types.String, required: true, validate: [isEmail, 'Email inválido'] })
  public email!: string

  @prop({ type: Schema.Types.String, required: true })
  public username!: string;

  @prop({ type: Schema.Types.String, required: true })
  public password!: string; 

  @prop({ type: () => Number }, PropType.MAP)
  public stats!: Map<string, number>

  @prop({ type: [Schema.Types.ObjectId], ref: 'User' })
  public friends?: Ref<ThisModel>[];

  static async insert(this: ThisModel, newDoc: Partial<User>) {
    return await new UserModel(newDoc).save();
  }

  static async findAll(this: ThisModel) {
    return await this.find().lean();
  }
}