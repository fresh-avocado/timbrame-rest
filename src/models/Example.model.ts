import { PropType, ReturnModelType, modelOptions, prop } from "@typegoose/typegoose";
import { Schema } from "mongoose";
import isEmail from 'validator/lib/isEmail'
import { ExampleModel } from "./models";

type ThisModel = ReturnModelType<typeof Example>;

@modelOptions({
  schemaOptions: {
    collection: 'Examples', // plural of Model name
    autoCreate: true, // should be false in prod
    autoIndex: true, // should be false in prod
  },
  options: {
    customName: 'Examples',
  }
})
export class Example {
  @prop({ type: Schema.Types.String, required: true })
  public name!: string

  @prop({ type: Schema.Types.String, required: true, validate: [isEmail, 'Email inválido'] })
  public email!: string

  @prop({ type: () => Number }, PropType.MAP)
  public stats!: Map<string, number>

  // this would be called like this: `const newExample = await ExampleModel.insert({ ... })` (much cleaner)
  static async insert(this: ThisModel, newDoc: Partial<Example>) {
    return await new ExampleModel(newDoc).save();
  }

  // this would be called like this: `const allExamples = await ExampleModel.findAll()` (much cleaner)
  static async findAll(this: ThisModel) {
    return await this.find().lean();
  }
}