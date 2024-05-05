import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import { apiRouter } from './routers/apiRouter';

dotenv.config();

const app = express();

// Security
app.use(helmet())
app.disable('x-powered-by')

// Middleware
app.use(cors());

// Routes
app.get('/api', apiRouter);

app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

export { app };
