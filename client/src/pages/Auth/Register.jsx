import { useState } from 'react'
import { useNavigate } from 'react-router';
import styles from './signin.module.css';
import Notification from "../../components/layout/Notification"

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleRegister() {
        try {
            if (!username || !email || !password || !confirmPassword) {
                setNotification({ message: "Please fill in all fields", error: true });
                return;
            }

            if (password !== confirmPassword) {
                setNotification({ message: "Passwords do not match", error: true });
                return;
            }

            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setNotification({ message: data.message, error: false });
                setTimeout(() => {
                    navigate('/login');
                }, 1500)
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || "Registration failed", error: true });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setNotification({ message: "Cannot connect to server. Is backend running?", error: true });
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', backgroundColor: '#111827', borderRadius: '12px', color: 'white', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', color: '#3b82f6', marginBottom: '20px' }}>Sign Up</h2>
            <div className="register-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    className={styles.input} 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white' }} 
                    placeholder="Username" 
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <input 
                    type="email" 
                    className={styles.input} 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white' }} 
                    placeholder="Email" 
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type="password" 
                    className={styles.input} 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white' }} 
                    placeholder="Password" 
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <input 
                    type="password" 
                    className={styles.input} 
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#1f2937', color: 'white' }} 
                    placeholder="Confirm Password" 
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
                
                <button 
                    onClick={handleRegister}
                    style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                >
                    Sign Up
                </button>
            </div>
            <div className='signup-redirect' style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#9ca3af' }}>
                <p>Already have an account? <a style={{cursor: 'pointer', color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold'}} onClick={() => navigate("/login")}>Log In</a></p>
            </div>      
            {notification.message && (
                <Notification message={notification.message} error={notification.error} />  
            )}
        </div>
    )
}