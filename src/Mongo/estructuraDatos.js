const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'customer'], required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    type: { type: String, required: true }, // Discriminator key
    destacado: { type: Boolean, default: false },
    modifiedAt: { type: Date, default: Date.now },
    status: { 
        type: String, 
        enum: ['available', 'sold', 'reserved', 'building'], 
        default: 'available' 
    },
    image: { type: String } // URL
});

const BillSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    price: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Bill = mongoose.model('Bill', BillSchema);

module.exports = { User, Product, Bill };
