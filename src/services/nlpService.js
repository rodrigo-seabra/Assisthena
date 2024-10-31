const { NlpManager } = require('node-nlp');
const Conversation = require('../models/conversationModel');
const fs = require('fs');
const path = require('path');
const manager = new NlpManager({ languages: ['pt'], forceNER: true });



const documents = [
    // 4º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 4ano", intent: "response_for_4_class_professor" },
    { text: "o que o professor espera dos alunos do 4º ano?", intent: "response_for_4ano_expectations" },
    { text: "quais habilidades são importantes para o 4º ano?", intent: "response_for_4ano_skills" },

    // 5º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 5ano", intent: "response_for_5_class_professor" },
    { text: "quais são as expectativas para os alunos do 5º ano?", intent: "response_for_5ano_expectations" },
    { text: "como melhorar a participação dos alunos no 5º ano?", intent: "response_for_5ano_participation" },

    // 6º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 6ano", intent: "response_for_6_class_professor" },
    { text: "quais atividades são recomendadas para o 6º ano?", intent: "response_for_6ano_activities" },
    { text: "como ajudar os alunos do 6º ano a se organizarem?", intent: "response_for_6ano_organization" },

    // 7º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 7ano", intent: "response_for_7_class_professor" },
    { text: "quais são os desafios do 7º ano?", intent: "response_for_7ano_challenges" },
    { text: "como motivar os alunos do 7º ano?", intent: "response_for_7ano_motivation" },

    // 8º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 8ano", intent: "response_for_8_class_professor" },
    { text: "quais habilidades os alunos devem desenvolver no 8º ano?", intent: "response_for_8ano_skills" },
    { text: "como abordar temas complexos com os alunos do 8º ano?", intent: "response_for_8ano_complex_themes" },

    // 9º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 9ano", intent: "response_for_9_class_professor" },
    { text: "quais são os principais tópicos para o 9º ano?", intent: "response_for_9ano_topics" },
    { text: "como preparar os alunos do 9º ano para o ensino médio?", intent: "response_for_9ano_preparation" },

    // 1º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 1medio", intent: "response_for_1_high_school_professor" },
    { text: "quais as dificuldades que os alunos do 1º ano enfrentam?", intent: "response_for_1ano_difficulties" },
    { text: "como adaptar o ensino para o 1º ano do ensino médio?", intent: "response_for_1ano_adaptation" },

    // 2º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 2medio", intent: "response_for_2_high_school_professor" },
    { text: "quais são os tópicos mais importantes para o 2º ano?", intent: "response_for_2ano_topics" },
    { text: "como os alunos podem se preparar para os exames do 2º ano?", intent: "response_for_2ano_preparation" },

    // 3º Ano
    { text: "o professor está pedindo mais detalhes e feedbacks e insights sobre o 3medio", intent: "response_for_3_high_school_professor" },
    { text: "qual a melhor forma de revisar para o vestibular?", intent: "response_for_3ano_review" },
    { text: "como ajudar os alunos do 3º ano com a pressão dos exames?", intent: "response_for_3ano_exam_pressure" },

    { text: "quais temas são importantes na história", intent: "duvidas_historicas_conteudo" },
    { text: "como ensinar revolução industrial", intent: "metodologia_historica" },
    { text: "quais são as consequências da 2ª guerra mundial", intent: "consequencias_historicas" },
    { text: "importância da história na formação do cidadão", intent: "importancia_historica" },
    { text: "quais fontes usar para estudar história", intent: "fontes_historicas" },
    { text: "quais são os eventos mais importantes da Idade Média", intent: "duvidas_historicas_idade_media" },
    { text: "como ensinar sobre a colonização do Brasil", intent: "metodologia_colonizacao" },
    { text: "quais os principais eventos da história do Brasil?", intent: "historical_themes" },
    { text: "como abordar a história contemporânea em sala de aula?", intent: "teaching_contemporary_history" },

    { text: "como resolver equações do 2º grau", intent: "duvidas_matematica_equacoes" },
    { text: "importância da matemática no dia a dia", intent: "importancia_matematica" },
    { text: "quais são os principais conceitos de geometria", intent: "conceitos_geometria" },
    { text: "como aplicar a matemática no cotidiano dos alunos?", intent: "mathematics_in_daily_life" },
    { text: "quais são as melhores práticas para ensinar frações?", intent: "best_practices_fractions" },

    { text: "como funciona o ciclo da água", intent: "ciclo_da_agua" },
    { text: "quais são as leis de Newton", intent: "letras_de_newton" },
    { text: "importância da biologia na saúde", intent: "importancia_biologia" },
    { text: "como explicar a fotossíntese para os alunos?", intent: "photosynthesis_explanation" },
    { text: "quais são os principais sistemas do corpo humano?", intent: "human_body_systems" },

    { text: "como melhorar a redação", intent: "duvidas_redacao" },
    { text: "quais são os principais gêneros textuais", intent: "generos_textuais" },
    { text: "importância da literatura", intent: "importancia_literatura" },
    { text: "como incentivar a leitura entre os alunos?", intent: "encouraging_reading" },
    { text: "qual a diferença entre narração e descrição?", intent: "narration_vs_description" },

    { text: "como lidar com a ansiedade na escola", intent: "orientacao_ansiedade" },
    { text: "como organizar o tempo para estudar", intent: "organizacao_tempo" },
    { text: "dicas para trabalhos em grupo", intent: "dicas_trabalhos_grupo" },
    { text: "como melhorar a comunicação entre alunos e professores?", intent: "improving_communication" },
    { text: "quais são as melhores práticas para uma boa convivência escolar?", intent: "good_school_living_practices" },

    { text: "como planejar meu futuro", intent: "planejamento_futuro" },
    { text: "importância do autoconhecimento", intent: "autoconhecimento" },
    { text: "como definir metas pessoais", intent: "definicao_metas" },
    { text: "como encontrar a minha vocação profissional?", intent: "finding_vocation" },
    { text: "quais passos seguir para alcançar um sonho?", intent: "steps_to_achieve_dreams" },
    { text: "oi", intent: "greeting" },
    { text: "olá", intent: "greeting" },
    { text: "bom dia", intent: "greeting" },
    { text: "boa tarde", intent: "greeting" },
    { text: "boa noite", intent: "greeting" },
    { text: "oi, tudo bem?", intent: "greeting" },
    { text: "como estão as coisas?", intent: "greeting" },

];


// Função para adicionar documentos ao NLP manager
const addDocumentsToManager = (docs) => {
    docs.forEach(doc => manager.addDocument('pt', doc.text, doc.intent));
};

// Adicionando os documentos ao gerenciador
addDocumentsToManager(documents);



const addAnswersFromJson = () => {
    const filePath = path.join(__dirname, '../data/response.json'); // Caminho para o arquivo JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo JSON:', err);
            return;
        }

        try {
            const responses = JSON.parse(data); // Faz o parsing do JSON
            Object.entries(responses).forEach(([intent, answer]) => {
                manager.addAnswer('pt', intent, answer);
            });
            console.log('Respostas adicionadas com sucesso.');
        } catch (parseError) {
            console.error('Erro ao analisar o arquivo JSON:', parseError);
        }
    });
};

addAnswersFromJson();

const trainNLP = async () => {
    await manager.train();
    manager.save();
};
const processInput = async (text) => {
    const response = await manager.process('pt', text);
    return response;
};


const updateNLPModel = async (proposedIntents) => {
    for (const { intent, topic } of proposedIntents) {
        if (topic) {
            manager.addDocument('pt', topic, intent);
            manager.addAnswer('pt', intent, `Nova resposta para a intenção: ${intent}`);
        }
    }

    await trainNLP();
    console.log('Modelo NLP re-treinado com novas intenções.');
};

module.exports = { trainNLP, processInput, updateNLPModel };
