import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; // Pozor: raději z 'react-router-dom' než 'react-router'
import useUserStore from '../../store/usePlayerStore'
import styles from './signin.module.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [notification, setNotification] = useState({message: '', error: false})
    
    const setUserData = useUserStore((state) => state.setUserData);
    const fetchUser = useUserStore((state) => state.fetchUser);

    async function handleLogin() {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Login success:", data);

                localStorage.setItem('userId', data.userId);

                setUserData({ 
                    userId: data.userId, 
                    username: username, 
                    isLoggedIn: true, 
                });

                await fetchUser(data.userId);

                // 3. Přesměrování
                navigate('/');
            }
            else {
                const errorData = await response.json();
                setNotification({ message: errorData.message, error: true });
            }

        } catch (error) {
            console.error("Error during login:", error);
            setNotification({ message: "Server unreachable", error: true });
        }
    }

    return (
        <>
        <h2>Log In</h2>
        <div className={'login-form'}>
            <input 
                name="username"
                type="text" 
                className={styles.input} // Pozor: styles={} vs className={}
                placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)}
            />
            <input 
                name="password"
                type="password" 
                className={styles.input} 
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <button onClick={handleLogin}>Log In</button>
        </div>
        
        <div className='signup-redirect'>
            <p>Don't have an account? <a style={{cursor: 'pointer'}} onClick={() => navigate('/register')}>Register</a></p>
        </div>

        {notification.message && (
            <div className={`notification ${notification.error ? 'error' : ''}`}>
                {notification.message}
            </div>
        )}
        </>
    )
}