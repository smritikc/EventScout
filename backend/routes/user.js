import express from 'express';

const router = express.Router();

// test route
router.get('/', (req, res) => {
  res.send('Users route working');
});

export default router;