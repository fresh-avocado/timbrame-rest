import { PropType, ReturnModelType, Ref, modelOptions, prop, DocumentType } from "@typegoose/typegoose";
import { FlattenMaps, Schema, Types } from "mongoose";
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
  public firstName!: string

  @prop({ type: Schema.Types.String, required: true })
  public lastName!: string

  @prop({ type: Schema.Types.String, unique: true, required: true, validate: [isEmail, 'Email inválido'] })
  public email!: string

  @prop({ type: Schema.Types.String, unique: true, required: true })
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

  static async findByEmail(this: ThisModel, email: string) {
    return await this.findOne({ email }).lean();
  }

  static async findByUsername(this: ThisModel, username: string) {
    return await this.findOne({ username }).lean();
  }
  
  static async isDuplicateEmail(this: ThisModel, email: string) {
    const res = await this.findOne({ email }).lean().select('_id')
    return res !== null;
  }

  static async isDuplicateUsername(this: ThisModel, username: string) {
    const res = await this.findOne({ username }).lean().select('_id')
    return res !== null;
  }

  static async findAll(this: ThisModel) {
    return await this.find().lean();
  }
}

export type UserDocument = DocumentType<User>;
export type UserLeanDocument = FlattenMaps<User> & { _id: Types.ObjectId };
