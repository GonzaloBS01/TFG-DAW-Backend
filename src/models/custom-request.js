import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    jewelryType: {
        type: String,
        required: true,
        enum: ['anillo', 'colgante', 'pendientes', 'pulsera', 'broche', 'otro'],
    },
    materials: { type: String },
    description: { type: String, required: true },
    budget: { type: String },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'completed', 'rejected'],
        default: 'pending',
    },
}, { timestamps: true });

export default mongoose.model('CustomRequest', customRequestSchema);
