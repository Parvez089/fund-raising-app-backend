import mongoose, { Schema, Document } from 'mongoose';

export interface IStats extends Document {
  totalFundRaised: number;
  targetGoal: number;
  activeParticipants: number;
  lastUpdated: Date;
}

const StatsSchema: Schema = new Schema({
  totalFundRaised: { type: Number, required: true },
  targetGoal: { type: Number, required: true },
  activeParticipants: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IStats>('Stats', StatsSchema);