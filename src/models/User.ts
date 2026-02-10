import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },
    password: { type: String }, // Optional because Google/Phone Auth users won't have it
    googleId: { type: String },
    avatar: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        landmark: String
    },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    createdAt: { type: Date, default: Date.now },
});



const User = models.User || model('User', UserSchema);

export default User;
