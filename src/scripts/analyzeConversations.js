const schedule = require('node-schedule');
const { analyzeConversations } = require('../utils/analysisUtils');
const { updateNLPModel } = require('../services/nlpService'); // Função que atualiza o modelo NLP

// Configura o agendamento para rodar a cada hora
schedule.scheduleJob('0 * * * *', async () => {
    try {
        const proposedIntents = await analyzeConversations(); // Chama a função de análise de conversas

        // Se houver novas intenções, atualize o modelo NLP
        if (proposedIntents && proposedIntents.length > 0) {
            console.log('Novas intenções propostas:', proposedIntents);

            // Atualize o modelo com as novas intenções propostas
            await updateNLPModel(proposedIntents);
            console.log('Modelo NLP atualizado com novas intenções.');
        } else {
            console.log('Nenhuma nova intenção proposta.');
        }
    } catch (error) {
        console.error('Erro ao analisar conversas:', error);
    }
});
