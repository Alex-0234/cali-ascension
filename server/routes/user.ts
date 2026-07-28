import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.use(requireAuth);

router.get('/me', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ message: 'Server error fetching user data' });
    }
});

router.post('/me', async (req, res) => {
    try {
        const updatedData = req.body;

        const user = await User.findOneAndUpdate({ userId: req.userId }, updatedData, { new: true });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send({ message: 'Server error updating user data' });
    }
});

export default router;
