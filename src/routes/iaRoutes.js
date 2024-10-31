const express = require('express');
const { handleUserInput } = require('../controllers/iaController');
const router = express.Router();

router.post('/process', handleUserInput);

module.exports = router;
