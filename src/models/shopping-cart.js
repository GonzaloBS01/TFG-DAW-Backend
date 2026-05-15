import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  // Guardar el precio en el momento de añadir al carrito
  // por si el precio del producto cambia después
});

const shoppingCartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [cartItemSchema],
  status: {
    type: String,
    enum: ['active', 'abandoned', 'processed'],
    default: 'active',
  },
  total: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Método para calcular el total del carrito
shoppingCartSchema.methods.calculateTotal = function () {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return this.total;
};

shoppingCartSchema.pre('save', function (next) {
  this.calculateTotal();
  this.lastActive = new Date();
  next();
});

// Método estático para encontrar o crear un carrito activo para un usuario
shoppingCartSchema.statics.findOrCreateByUser = async function (userId) {
  let cart = await this.findOne({ user: userId, status: 'active' });
  if (!cart) {
    cart = new this({ user: userId, items: [] });
  }
  return cart;
};

export default mongoose.model('ShoppingCart', shoppingCartSchema);
