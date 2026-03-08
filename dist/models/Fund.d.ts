/** @format */
import mongoose, { Document } from "mongoose";
export interface IFund extends Document {
    amount: number;
    campaign: string;
    donorName?: string;
    donorEmail?: string;
    note?: string;
    createdAt: Date;
}
export declare const Fund: mongoose.Model<IFund, {}, {}, {}, mongoose.Document<unknown, {}, IFund, {}, mongoose.DefaultSchemaOptions> & IFund & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IFund>;
//# sourceMappingURL=Fund.d.ts.map