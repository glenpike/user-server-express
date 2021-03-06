import express from 'express';
import registerRoutes from './register';
import userRoutes from './user';

const router = express.Router(); // eslint-disable-line new-cap

/* GET /api-status - Check service status */
router.get('/api-status', (req, res) => res.json({ status: 'ok' }));

router.use('/register', registerRoutes);
router.use('/user', userRoutes);

export default router;
