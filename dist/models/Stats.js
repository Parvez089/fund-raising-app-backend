import mongoose, { Schema, Document } from 'mongoose';
const StatsSchema = new Schema({
    totalFundRaised: { type: Number, required: true },
    targetGoal: { type: Number, required: true },
    activeParticipants: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
});
export default mongoose.model('Stats', StatsSchema);
//# sourceMappingURL=Stats.js.map