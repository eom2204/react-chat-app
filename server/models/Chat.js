const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema({
    chatId: { type: String, required: true, unique: true },
    user:  { type: String, required: true },
    messages:  { type: Array, default: [] },
    avatar: { type: String },
    timestamp: {type: Date, default: Date.now},
    owner: { type: String, required: true }, // owner of the chat
})

module.exports = mongoose.model("Chat", ChatSchema);