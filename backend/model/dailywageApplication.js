const mongoose = require('mongoose');

const dailyWageApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyWageJob',
        required: true
    },
    seekerId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure one application per job per seeker
dailyWageApplicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

const DailyWageApplication = mongoose.model('DailyWageApplication', dailyWageApplicationSchema);

module.exports = DailyWageApplication;
