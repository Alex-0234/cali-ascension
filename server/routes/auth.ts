import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { setAuthCookie, clearAuthCookie } from '../utils/authCookie.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const usernameAlreadyExists = await User.findOne({ username });
        const emailAlreadyExists = await User.findOne({ email });

        if (usernameAlreadyExists) {
            return res.status(400).send({ message: 'Username already exists' });
        }
        if (emailAlreadyExists) {
            return res.status(400).send({ message: 'There is an account under this e-mail already' });
        }

        const dateNow = new Date().toISOString().split('T')[0];
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS as string));

        const newUser = new User({
            userId: Date.now(),
            username,
            email,
            password: hashedPassword,
            dateCreated: dateNow,
        });

        await newUser.save();

        setAuthCookie(res, String(newUser.userId));
        res.status(201).send({ message: 'User registered successfully!', userId: newUser.userId });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ message: 'Server error during registration' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username && !email) return res.status(400).send({ message: 'Invalid username or password' });
        const exists = await User.findOne({ $or: [{ username }, { email }] }).select('+password');
        const passwordMatch = exists ? await bcrypt.compare(password, exists.password) : false;

        if (!exists || !passwordMatch) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        setAuthCookie(res, String(exists.userId));
        res.status(200).send({ message: 'User logged in successfully!', userId: exists.userId });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Server error during login' });
    }
});

router.post('/logout', (req, res) => {
    clearAuthCookie(res);
    res.status(200).send({ message: 'Logged out' });
});

export default router;
