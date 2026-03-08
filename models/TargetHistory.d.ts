/** @format */
import mongoose, { Document } from "mongoose";
export interface ITargetHistory extends Document {
    targetAmount: number;
    previousAmount: number;
    changedBy: string;
    changedByInitials: string;
    reason: string;
    effectiveDate: Date;
    createdAt: Date;
}
export declare const TargetHistory: mongoose.Model<ITargetHistory, {}, {}, {}, mongoose.Document<unknown, {}, ITargetHistory, {}, mongoose.DefaultSchemaOptions> & ITargetHistory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITargetHistory>;
//# sourceMappingURL=TargetHistory.d.ts.map