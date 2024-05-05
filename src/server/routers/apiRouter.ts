import express from 'express';
const apiRouter = express.Router();

// Define routes here
apiRouter.get('/', (req, res) => {
  res.send('User List');
});

export { apiRouter };
