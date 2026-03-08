/** @format */
import mongoose, { Document } from "mongoose";
export interface IAdmin extends Document {
    email: string;
    password: string;
    role: "super_admin" | "admin";
    createdAt: Date;
}
export declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin, {}, mongoose.DefaultSchemaOptions> & IAdmin & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IAdmin>;
//# sourceMappingURL=Admin.d.ts.map