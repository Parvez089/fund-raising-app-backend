import mongoose, { Document } from 'mongoose';
export interface IStats extends Document {
    totalFundRaised: number;
    targetGoal: number;
    activeParticipants: number;
    lastUpdated: Date;
}
declare const _default: mongoose.Model<IStats, {}, {}, {}, mongoose.Document<unknown, {}, IStats, {}, mongoose.DefaultSchemaOptions> & IStats & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IStats>;
export default _default;
//# sourceMappingURL=Stats.d.ts.map