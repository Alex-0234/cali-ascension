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

// The shared demo account is public: anyone can sign in and, without this, anyone
// could delete it. It resets instead, so the next visitor still has an account to
// log into. Overridable so a deployment can point it at a different username.
const DEMO_USERNAME = (process.env.DEMO_USERNAME ?? 'test').toLowerCase();

const isDemoAccount = (username?: string | null) =>
    Boolean(username) && username!.toLowerCase() === DEMO_USERNAME;

// Everything a fresh registration would have — identity, credentials and
// dateCreated are deliberately absent so they survive the reset.
const DEMO_RESET_STATE = {
    userInfo: { visibleName: null, age: null, gender: null, weight: null, height: null },
    title: null,
    color: 'lightblue',
    bioStatus: 'optimal',
    streak: { current: 0, highest: 0 },
    rating: 100,
    level: 0,
    prestige: 0,
    prestigeXPConsumed: 0,
    xp: 0,
    ep: 0,
    stats: { STR: 10, HYP: 10, END: 10, POW: 10, BAL: 10, AP: 10 },
    exerciseProgress: {},
    customTrackers: [],
    customWorkouts: [],
    workoutHistory: {},
    isConfigured: false,
};

// The client needs to know which account it's on to label the danger zone
// correctly; the server stays the one that actually enforces it.
function toClient(user: { toObject: () => Record<string, unknown>; username?: string | null }) {
    return { ...user.toObject(), isDemo: isDemoAccount(user.username) };
}

router.get('/me', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(toClient(user));
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
        res.status(200).send(toClient(user));
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send({ message: 'Server error updating user data' });
    }
});

// Right to erasure: removes the record outright rather than flagging it, and ends
// the session so the client can't keep syncing into a deleted account.
router.delete('/me', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // The demo account is wiped rather than removed, and the session is left
        // intact so the visitor lands in a clean app instead of a dead login.
        if (isDemoAccount(user.username)) {
            await User.updateOne({ userId: req.userId }, DEMO_RESET_STATE);
            return res.status(200).send({ message: 'Demo account reset', reset: true });
        }

        await User.deleteOne({ userId: req.userId });
        clearAuthCookie(res);
        res.status(200).send({ message: 'Account deleted', reset: false });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send({ message: 'Server error deleting account' });
    }
});

export default router;
