import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    color: { type: String, default: '#a3e635' },
    icon: { type: String, default: '📁' },

    status: {
        type: String,
        enum: ['active', 'paused', 'completed', 'archived'],
        default: 'active',
    },

    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },

    tags: { type: [String], default: [] },
}, { timestamps: true });

projectSchema.index({ name: 'text', description: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;