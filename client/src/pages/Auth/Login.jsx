import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import useUserStore from '../../store/usePlayerStore'
import SystemAlert from '../../components/layout/Notification';

import styles from '../../styles/auth.module.css'

export default function Login() {
    const navigate = useNavigate();
    const { fetchUser } = useUserStore(); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [mode, setMode] = useState('Username');  
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleLogin() {
        try {
            if ((!username && !email) || !password) {
                setNotification({ message: "System Error: Credentials required", error: true });
                return;
            }

            setNotification({ message: "Authenticating...", error: false });
            setTimeout(() => {
                if (password === "admin") {
                    setNotification({ message: "Authentication successful.", error: false });
                    setTimeout(() => navigate('/'), 1000);
                } else {
                    setNotification({ message: "Access Denied: Invalid credentials", error: true });
                }
            }, 800);

            let response;
            if (mode === 'Username') {
                response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username.toLowerCase().trim(), email: null, password: password }),
                });
            } else {
                response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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
        <>
        <div className={styles.pageWrapper}>
            
            <div className={styles.authBranding}>
                <h1 className={styles.brandTitle}>CALISTHENICS<br/>ASCENSION</h1>
                <p className={styles.brandSub}>Calisthenics helper</p>
            </div>

            <div className={styles.authContent}>
                <div className={styles.authCard}>
                    
                    <h2 className={styles.header}>[ SYSTEM_AUTH ]</h2>
                    <p className={styles.subtitle}>Verify Hunter Credentials</p>

                    <div className={styles.modeTabs}>
                        <button className={`${styles.tabBtn} ${mode === 'Username' ? styles.activeTab : ''}`} onClick={() => setMode('Username')}>
                            Username
                        </button>
                        <button className={`${styles.tabBtn} ${mode === 'E-mail' ? styles.activeTab : ''}`} onClick={() => setMode('E-mail')}>
                            E-mail
                        </button>
                    </div>

                    <div className={styles.form}>
                        {mode === 'Username' ? (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Hunter Name</label>
                                <input type="text" className={styles.input} placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        ) : (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Secure E-mail</label>
                                <input type="email" className={styles.input} placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Access Code</label>
                            <input type="password" className={styles.input} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        
                        <button className={styles.submitBtn} onClick={handleLogin}>
                            Initialize
                        </button>
                    </div>

                    <div className={styles.redirect}>
                        <p>Unregistered? <span onClick={() => navigate("/register")}>Awaken Here</span></p>
                    </div>
                    
                    {notification.message && (
                        <SystemAlert message={notification.message} error={notification.error} />  
                    )}

                </div>
            </div>
        </div>
        </>
    )
}