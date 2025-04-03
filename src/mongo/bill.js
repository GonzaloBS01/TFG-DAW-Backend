import mongoose from 'mongoose';

export const BillSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

