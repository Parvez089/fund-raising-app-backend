import Stats from '../models/Stats.js';
export const getStats = async (req, res) => {
    try {
        const stats = await Stats.findOne();
        if (!stats) {
            res.status(404).json({ message: 'Statistics not found' });
            return;
        }
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
//# sourceMappingURL=statsControllers.js.map