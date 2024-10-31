const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const iaRoutes = require('./routes/iaRoutes');
const connectDB = require('./config/database');

const { trainNLP } = require('./services/nlpService');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", 
    methods: 'GET, POST, PUT, DELETE',
    credentials: true, 
}));


connectDB();

trainNLP();

app.use('/api', iaRoutes); 

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
