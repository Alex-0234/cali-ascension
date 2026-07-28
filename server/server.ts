import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        process.env.LOCALHOST_URL,
        process.env.VERCEL_BRANCH_URL,
        process.env.VERCEL_URL,
    ].filter((origin): origin is string => Boolean(origin)),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('System API is running!');
});

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
