import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Api3rdKeyDocument = HydratedDocument<api3rdKey>;

@Schema({ timestamps: true })
export class api3rdKey {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  api3rd_key: string;

  @Prop()
  apiId: number;

  @Prop()
  apiHash: string;
}

export const Api3rdKeySchema = SchemaFactory.createForClass(api3rdKey);
