import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    // Handle user registration logic here

    res.json({ message: 'User registered successfully!' });
});
app.post('/api/login', (req, res) => {
    // Handle user login logic here
    res.json({ message: 'User logged in successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}
);