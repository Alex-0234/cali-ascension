import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SystemAlert from '../../components/layout/Notification';
import validatePassword from '../../utils/validatePassword';

import styles from '../../styles/auth.module.css'

export default function Register() {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleRegister(e) {
        if (e) e.preventDefault();
        
        try {
            if (!username || !email || !password || !confirmPassword) {
                setNotification({ message: "System Error: Missing required fields", error: true });
                return;
            }

            if (password !== confirmPassword) {
                setNotification({ message: "System Error: Passwords mismatch", error: true });
                return;
            }

            const { isValid, errors } = validatePassword(password);    
            
            if (isValid) {
                setNotification({ message: "Hunter Registered. Preparing system...", error: false });
                setTimeout(() => navigate('/login'), 1500);

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username.toLowerCase().trim(), email: email.trim(), password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotification({ message: "Hunter Registered. Preparing system...", error: false });
                    setTimeout(() => navigate('/login'), 1500);
                } else {
                    const errorData = await response.json();
                    setNotification({ message: errorData.message || "Registration failed", error: true });
                }
            } else {
                setNotification({ message: errors, error: true });
            }

        } catch (error) {
            console.error("Registration error:", error);
            setNotification({ message: "Cannot connect to server.", error: true });
        }
    }

    return (
        <>
        <div className={styles.pageWrapper}>
            <div className={styles.authCard}>
                
                <h2 className={styles.headerRed}>[ NEW AWAKENING ]</h2>
                <p className={styles.subtitleRed}>Register new Hunter to the System</p>

                <form className={styles.form}>
               
                    <div className={styles.inputGroup}>
                        <label htmlFor='username' className={styles.label}>Username</label>
                        <input 
                            type="text" 
                            id='username'
                            className={styles.inputRed} 
                            placeholder="Enter Hunter Name" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete='username' />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='email' className={styles.label}>E-mail</label>
                        <input 
                            type="email" 
                            id='email'
                            className={styles.inputRed} 
                            placeholder="Enter E-mail Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='email' />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='password' className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            id='password'
                            className={styles.inputRed} 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete='new-password' />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor='confirmPassword' className={styles.label}>Verify Password</label>
                        <input 
                            type="password" 
                            id='confirmPassword'
                            className={styles.inputRed} 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete='new-password' />
                    </div>
                    
                    <button className={styles.submitBtnRed} onClick={handleRegister}>
                        INITIALIZE HUNTER
                    </button>
                </form>

                <div className={styles.redirect}>
                    <p>Already awakened? <span onClick={() => navigate("/login")}>Access System</span></p>
                </div>
                
                {notification.message && (
                    <SystemAlert message={notification.message} error={notification.error} />  
                )}

            </div>
        </div>
        </>
    )
}