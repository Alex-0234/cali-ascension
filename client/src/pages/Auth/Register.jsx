import { useState } from 'react'
import { useNavigate } from 'react-router';
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
                setNotification({ message: "System Error: Missing required fields", error: true });
                return;
            }

            if (password !== confirmPassword) {
                setNotification({ message: "System Error: Passwords mismatch", error: true });
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setNotification({ message: "Hunter Registered. Preparing system...", error: false });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                const errorData = await response.json();
                setNotification({ message: errorData.message || "Registration failed", error: true });
            }
        } catch (error) {
            setNotification({ message: "Cannot connect to server.", error: true });
        }
    }

    return (
        <div className="auth-page">
            {/* Urgent Quest kontejner pro registraci */}
            <div className="auth-box urgent-theme">
                <h2 className="auth-header red-glow">[ NEW AWAKENING DETECTED ]</h2>
                <p className="auth-subtitle blinking-red">Register new Hunter to the System</p>

                <div className="auth-form">
                    <input 
                        type="text" 
                        className="system-input input-red" 
                        placeholder="Hunter Name" 
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                    <input 
                        type="email" 
                        className="system-input input-red" 
                        placeholder="Email Address" 
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        className="system-input input-red" 
                        placeholder="Password" 
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <input 
                        type="password" 
                        className="system-input input-red" 
                        placeholder="Confirm Password" 
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    
                    <button className="btn-urgent auth-btn" onClick={handleRegister}>
                        INITIALIZE HUNTER
                    </button>
                </div>

                <div className="auth-redirect">
                    <p>Already awakened? <span onClick={() => navigate("/login")} style={{cursor: 'pointer'}}>Access System</span></p>
                </div>
                
                {notification.message && (
                    <Notification message={notification.message} error={notification.error} />  
                )}
            </div>
        </div>
    )
}