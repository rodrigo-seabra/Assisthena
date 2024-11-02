const { processInput } = require('../services/nlpService');
const { storeConversation, getConversationsByUserId } = require('../models/conversationModel');

const handleUserInput = async (req, res) => {
    const { userId, userInput, userType } = req.body;
    const response = await processInput(userInput);
    await storeConversation(userId, userType, userInput, response.answer); // Armazena a conversa
    res.json({ response: response.answer });
};

const getUserConversations = async (req, res) => {
    const { userId } = req.body; 

    if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório.' });
    }

    try {
        const conversations = await getConversationsByUserId(userId);
        res.json(conversations); // Retorna as conversas encontradas
    } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        res.status(500).json({ error: 'Erro ao buscar conversas.' });
    }
};

module.exports = { handleUserInput, getUserConversations };
