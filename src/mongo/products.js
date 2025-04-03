import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    type: { type: String, required: true }, // Discriminator key
    destacado: { type: Boolean, default: false },
    modifiedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['available', 'sold', 'reserved', 'building'],
        default: 'available',
    },
    image: { type: String }, // URL
}, { timestamps: true });
