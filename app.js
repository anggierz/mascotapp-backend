require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

app.get('/sanity', (req, res) => {
	res.json({ status: 'ok', message: 'Backend is running' });
});

app.use(express.json());
app.use(helmet());

app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);


module.exports = app;