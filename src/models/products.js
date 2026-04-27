import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
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
    images: [{ type: String }], // Array for carousel
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
