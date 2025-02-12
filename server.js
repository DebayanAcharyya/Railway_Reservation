const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); 

const authRoutes = require('./src/routes/authRoutes');
const trainRoutes = require('./src/routes/trainRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app); 

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server }; 
