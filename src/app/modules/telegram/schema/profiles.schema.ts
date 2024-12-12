import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProfilesDocument = HydratedDocument<profile>;

@Schema({ timestamps: true })
export class profile {
  @Prop({ unique: true })
  phone: string;

  @Prop()
  apiId: number;

  @Prop()
  apiHash: string;

  @Prop()
  phoneCodeHash: string;

  @Prop()
  userId: number;

  @Prop()
  username: string;

  @Prop()
  session: string;
}

export const ProfilesSchema = SchemaFactory.createForClass(profile);
