import express from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { apiRouter } from './routers/apiRouter';


const app = express();

// Security
app.use(helmet())
app.disable('x-powered-by')

// Middleware
app.use(cors());

// Routes
app.use('/api', apiRouter);
app.use(express.static('public'));
app.use((req, res, next) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.send(`HTTP 404: ${req.url}`);
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'HTTP 404: Not found', url: req.url});
    return;
  }

  // default to plain-text
  res.type('txt').send(`HTTP 404: ${req.url}`);
});
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

export { app };
