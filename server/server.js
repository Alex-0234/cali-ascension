import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import User from './models/User.js';

connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://cali-ascension.onrender.com' // Nebo tvoje vlastní doména
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hunter API is running!');
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const usernameAlreadyExists = await User.findOne({ username: username });
        const emailAlreadyExists = await User.findOne({ email: email });

        if (!username || !email || !password) {
            return res.status(400).send({ message: 'All fields are required' });
        }
        if (usernameAlreadyExists) {
            return res.status(400).send({ message: 'Username already exists' });
        }
        if (emailAlreadyExists) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        const newUser = new User({
            userId: Date.now(), 
            username,
            email,
            password, 
        });

        await newUser.save();

        res.status(201).send({ message: 'User registered successfully!', userId: newUser.userId });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ message: 'Server error during registration' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const exists = await User.findOne({ username, password });

        if (!exists) {
            return res.status(400).send({ message: 'Invalid username or password' });
        }

        res.status(200).send({ message: 'User logged in successfully!' , userId: exists.userId});

    } catch (error) {
        console.error('Error during login:', error);    
        res.status(500).send({ message: 'Server error during login' });
    }
});

app.get('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({ userId: userId });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        } 
        res.status(200).send(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ message: 'Server error fetching user data' });
    }
});

app.post('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        const user = await User.findOneAndUpdate({ userId: userId }, updatedData, { new: true });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).send({ message: 'Server error updating user data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});