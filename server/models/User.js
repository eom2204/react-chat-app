const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user: { type: String, required: true },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }], // References to chat documents
});

module.exports = mongoose.model('User', UserSchema);