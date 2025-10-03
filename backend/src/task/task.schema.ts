import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
    @Prop({ required: true, trim: true }) title!: string;
    @Prop({ trim: true }) description?: string;
    @Prop({ default: false }) done!: boolean;
    @Prop() dueDate?: Date;
}
export const TaskSchema = SchemaFactory.createForClass(Task);
