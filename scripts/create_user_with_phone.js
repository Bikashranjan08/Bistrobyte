
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Config
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cloud-kitchen";
const USER_DATA = {
    name: "Test User Phone",
    email: "testphone@example.com",
    password: "password123",
    phone: "9876543210", // Example Indian Mobile
    role: "user"
};

// Schema Definition (Simplified)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    phoneVerified: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createUser() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if exists
        const existing = await User.findOne({ $or: [{ email: USER_DATA.email }, { phone: USER_DATA.phone }] });
        if (existing) {
            console.log("User already exists:", existing.email, existing.phone);
            process.exit(0);
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(USER_DATA.password, 10);

        // Create
        const newUser = await User.create({
            ...USER_DATA,
            password: hashedPassword,
            phoneVerified: true // Auto-verify for testing
        });

        console.log("User Created Successfully:");
        console.log("Name:", newUser.name);
        console.log("Email:", newUser.email);
        console.log("Phone:", newUser.phone);
        console.log("Password:", USER_DATA.password);

    } catch (error) {
        console.error("Error creating user:", error);
    } finally {
        await mongoose.disconnect();
    }
}

createUser();
