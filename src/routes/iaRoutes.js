const express = require('express');
const { handleUserInput, getUserConversations, pong } = require('../controllers/iaController');
const router = express.Router();

router.post('/process', handleUserInput);
router.post('/conversations', getUserConversations); 
router.get("/ping", pong )
module.exports = router;
