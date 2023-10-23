import { getModelForClass } from "@typegoose/typegoose";
import { Example } from "./Example.model";

export const ExampleModel = getModelForClass(Example)