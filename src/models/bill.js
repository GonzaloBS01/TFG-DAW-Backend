import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: { type: String, default: 'card' },
    billingAddress: { type: String },
}, { timestamps: true });

export default mongoose.model('Bill', billSchema);

