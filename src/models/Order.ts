import mongoose, { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
    itemId: { type: String, required: true }, // Keeping as String to match frontend IDs for now, or ObjectId if referencing another collection
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
});

const OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: String
    },
    phoneNumber: { type: String, required: true },
    paymentMethod: { type: String, default: 'COD', enum: ['COD', 'ONLINE'] },
    paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
    orderStatus: { type: String, default: 'Placed', enum: ['Placed', 'Preparing', 'OutForDelivery', 'Delivered', 'Cancelled'] },
    createdAt: { type: Date, default: Date.now },
});

const Order = models.Order || model('Order', OrderSchema);

export default Order;
