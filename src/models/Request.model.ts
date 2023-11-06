import { ReturnModelType, Ref, modelOptions, prop, DocumentType } from "@typegoose/typegoose";
import { FlattenMaps, Schema, Types } from "mongoose";
import { RequestModel } from "./models";

type ThisModel = ReturnModelType<typeof Request>;

@modelOptions({
  schemaOptions: {
    collection: 'Requests',
    autoCreate: true,
    autoIndex: true,
  },
  options: {
    customName: 'Requests',
  }
})
export class Request {
  @prop({ type: Schema.Types.ObjectId, ref: 'User', required: true})
  public from!: Ref<ThisModel>;

  @prop({ type: Schema.Types.ObjectId, ref: 'User', required: true})
  public to!: Ref<ThisModel>;

  @prop({ type: Schema.Types.String, required: true})
  public status!: string;

  static async insert(this: ThisModel, newDoc: Partial<Request>) {
    return await new RequestModel(newDoc).save();
  }

  static async findByIncoming(this: ThisModel, to: Types.ObjectId) {
    return await this.find({ to: to }).lean();
  }

  static async findByOutgoing(this: ThisModel, from: Types.ObjectId) {
    return await this.find({ from: from }).lean();
  }
}

export type RequestDocument = DocumentType<Request>;
export type RequestLeanDocument = FlattenMaps<Request> & { _id: Types.ObjectId };
