const { processInput } = require('../services/nlpService');
const { storeConversation } = require('../models/conversationModel');

const handleUserInput = async (req, res) => {
    const { userId, userInput, userType } = req.body;
    const response = await processInput(userInput);
    await storeConversation(userId, userType, userInput, response.answer); // Armazena a conversa
    res.json({ response: response.answer });
};

module.exports = { handleUserInput };
