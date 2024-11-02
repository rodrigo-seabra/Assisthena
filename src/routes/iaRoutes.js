const express = require('express');
const { handleUserInput, getUserConversations } = require('../controllers/iaController');
const router = express.Router();

router.post('/process', handleUserInput);
router.post('/conversations', getUserConversations); 

module.exports = router;
