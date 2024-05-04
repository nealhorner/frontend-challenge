import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});
app.get('/health', (req, res) => {
  res.send('Hello World!')
})
// const userRoutes = require('./routes/userRoutes');
// app.use('/api/users', userRoutes);

module.exports = app;