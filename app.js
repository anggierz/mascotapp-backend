require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(helmet());

app.use('/api/users', userRoutes);


module.exports = app;