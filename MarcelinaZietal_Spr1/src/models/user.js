const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const db = require('../utils/db');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], // Define the roles here
        default: 'user' // Default role is 'user'
    },
    isActive: Boolean,
    activationToken: String,
    tokenExpires: Date
});

userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this;
    return bcrypt.compare(candidatePassword, user.password);
};

const UserModel = db.model("users", userSchema);

module.exports = UserModel;