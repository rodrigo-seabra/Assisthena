const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userId: String,
    userInput: String,
    botResponse: String,
    userType: String,
    timestamp: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

const storeConversation = async (userId, userInput, botResponse) => {
    const newConversation = new Conversation({ userId, userInput, botResponse });
    await newConversation.save();
};

module.exports = { Conversation, storeConversation };
