import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';

dotenv.config();

const app = express();

// Security
app.use(helmet())
app.disable('x-powered-by')

// Middleware
app.use(cors());

app.use(express.static('public'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

export { app };
