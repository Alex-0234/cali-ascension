import { Router } from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { clearAuthCookie } from '../utils/authCookie.js';

const router = Router();

router.use(requireAuth);

// Fields the client owns and may write back. Anything else in the body is
// dropped, so identity (userId, username, email), credentials and dateCreated
// can't be reassigned by a crafted sync — and neither can any field added to the
// schema later without being listed here on purpose.
const WRITABLE_FIELDS = [
    'userInfo',
    'title',
    'color',
    'bioStatus',
    'streak',
    'rating',
    'level',
    'prestige',
    'prestigeXPConsumed',
    'xp',
    'ep',
    'stats',
    'exerciseProgress',
    'customTrackers',
    'customWorkouts',
    'workoutHistory',
    'isConfigured',
] as const;

function pickWritable(body: Record<string, unknown>) {
    const update: Record<string, unknown> = {};
    for (const field of WRITABLE_FIELDS) {
        if (body?.[field] !== undefined) update[field] = body[field];
    }
    return update;
}

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
        const user = await User.findOneAndUpdate(
            { userId: req.userId },
            pickWritable(req.body),
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send({ message: 'Server error updating user data' });
    }
});

// Right to erasure: removes the record outright rather than flagging it, and ends
// the session so the client can't keep syncing into a deleted account.
router.delete('/me', async (req, res) => {
    try {
        const result = await User.deleteOne({ userId: req.userId });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: 'User not found' });
        }

        clearAuthCookie(res);
        res.status(200).send({ message: 'Account deleted' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send({ message: 'Server error deleting account' });
    }
});

export default router;
