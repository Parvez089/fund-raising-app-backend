/** @format */
import mongoose, { Document } from "mongoose";
export interface IContributor extends Document {
    name: string;
    amount: number;
    message: string;
    avatarUrl: string;
    campaign: string;
    isAnonymous: boolean;
    createdAt: Date;
}
export declare const Contributor: mongoose.Model<IContributor, {}, {}, {}, mongoose.Document<unknown, {}, IContributor, {}, mongoose.DefaultSchemaOptions> & IContributor & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IContributor>;
//# sourceMappingURL=Contributor.d.ts.map