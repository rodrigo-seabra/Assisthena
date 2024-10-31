const { SentimentAnalyzer } = require('node-nlp'); // Suporta análise de sentimentos em vários idiomas
const { Conversation } = require('../models/conversationModel');
const { processInput } = require('../services/nlpService'); // Função para processar as mensagens

// Função para analisar conversas e criar contexto com base no histórico de mensagens
const analyzeConversations = async () => {
    const conversations = await Conversation.find({}); // Busca todas as conversas no banco de dados
    const topicCounts = {};
    const sentimentScores = [];

    const sentimentAnalyzer = new SentimentAnalyzer({ language: 'pt' });

    // Itera sobre as conversas, analisando a intenção e o sentimento de cada uma
    for (const convo of conversations) {
        const response = await processInput(convo.userInput);
        
        // Contexto de conversação: adicione intenção e sentimento para análise
        const sentiment = sentimentAnalyzer.getSentiment(convo.userInput);
        sentimentScores.push(sentiment.score); // Adiciona a pontuação de sentimento

        // Contagem de intenções para detecção de padrões
        const intent = response.intent;
        topicCounts[intent] = (topicCounts[intent] || 0) + 1;
    }

    console.log('Contagem de Tópicos:', topicCounts);
    console.log('Pontuação Média de Sentimento:', average(sentimentScores));

    // Propor novas intenções ou novos tópicos
    const proposedIntents = proposeNewIntents(topicCounts, conversations);
    console.log('Intenções Propostas:', proposedIntents);

    return proposedIntents;
};

// Calcula média das pontuações de sentimentos
const average = (arr) => arr.length ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;

// Propõe novas intenções e identifica tópicos não abordados
const proposeNewIntents = (topicCounts, conversations) => {
    const threshold = 3; // Limite para identificar intenções raras
    const proposedIntents = [];

    // Função auxiliar para detectar temas não abordados
    const unaddressedTopics = identifyUnaddressedTopics(conversations, Object.keys(topicCounts));
    proposedIntents.push(...unaddressedTopics);

    for (const [intent, count] of Object.entries(topicCounts)) {
        if (count < threshold) {
            proposedIntents.push({
                intent,
                reason: `A intenção "${intent}" tem baixa contagem (${count}). Considere adicionar mais exemplos ou perguntas relacionadas.`
            });
        }
    }

    return proposedIntents;
};

// Identifica tópicos não abordados nas intenções do NLP
const identifyUnaddressedTopics = (conversations, knownIntents) => {
    const topicSuggestions = [];
    const potentialTopics = new Set();

    for (const convo of conversations) {
        const words = convo.userInput.split(" ");
        
        // Identifica palavras que não pertencem às intenções já conhecidas
        words.forEach(word => {
            if (!knownIntents.includes(word) && !potentialTopics.has(word)) {
                potentialTopics.add(word);
                topicSuggestions.push({
                    topic: word,
                    reason: `O tópico "${word}" foi mencionado mas não possui uma intenção específica.`
                });
            }
        });
    }

    return topicSuggestions;
};

module.exports = { analyzeConversations };
