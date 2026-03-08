import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import useUserStore from '../../store/usePlayerStore'
import SystemAlert from '../../components/layout/Notification';

import styles from '../../styles/auth.module.css'

export default function Login() {
    const navigate = useNavigate();
    const fetchUser = useUserStore((state) => state.fetchUser); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")
    const [mode, setMode] = useState(true); 
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleLogin() {
        try {
            if ((!username && !email) || !password) {
                setNotification({ message: "System Error: Credentials required", error: true });
                return;
            }

            let response;
            if (mode) {
                response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username.toLowerCase().trim(), email: null, password: password }),
                });
            }
            else {
                response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: null, email: email.trim(), password: password }),
                });
            }

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userId', data.userId);        
                await fetchUser(data.userId); 

                setNotification({ message: "Authentication successful...", error: false });
                setTimeout(() => navigate('/'), 1000);

            } else {
                setNotification({ message: data.message || "Access Denied: Invalid credentials", error: true });
            }
        } catch (error) {
            console.error("Login error:", error);
            setNotification({ message: "Server connection failed.", error: true });
        }
    }

    return (
        <div className={styles.page}>
            <div className={`${styles.box} ${styles.themeStandard}`}>
                <h2 className={`${styles.header} ${styles.glowBlue}`}>[ SYSTEM AUTHENTICATION ]</h2>
                <p className={styles.subtitle}>Verify Hunter Credentials</p>

                <div className={styles.form}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        { mode ? (
                            <input 
                            type="text" 
                            className={`${styles.input} ${styles.inputBlue}`} 
                            placeholder="Username" 
                            onChange={(e)=>setUsername(e.target.value)}
                            />
                        
                        ) : (
                            <input 
                            type="email" 
                            className={`${styles.input} ${styles.inputBlue}`} 
                            placeholder="E-mail" 
                            onChange={(e)=>setEmail(e.target.value)}
                            />
                        )}
                        <button 
                        className='generic-btn' 
                        style={{width: '40%', height: 'auto', background: 'transparent', marginLeft: '0.5rem' }} 
                        onClick={() => setMode(!mode)}>Toggle e-mail</button>
                    </div>
   
                    <input 
                        type="password" 
                        className={`${styles.input} ${styles.inputBlue}`} 
                        placeholder="Password" 
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    
                    <button className={`btn-enter ${styles.btn}`} onClick={handleLogin}>
                        ENTER SYSTEM
                    </button>
                </div>

                <div className={styles.redirect}>
                    <p>Unregistered? <span onClick={() => navigate("/register")}>Awaken Here</span></p>
                </div>
                
                {notification.message && (
                    <SystemAlert message={notification.message} error={notification.error} onClick={() => setNotification({ message: "", error: false })} />  
                )}
            </div>
        </div>
    )
}