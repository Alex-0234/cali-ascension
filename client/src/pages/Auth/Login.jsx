import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import useUserStore from '../../store/usePlayerStore'
import Notification from "../../components/layout/Notification"

export default function Login() {
    const navigate = useNavigate();
    const fetchUser = useUserStore((state) => state.fetchUser); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleLogin() {
        try {
            if (!username || !password) {
                setNotification({ message: "System Error: Credentials required", error: true });
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, password: password }),
            });

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
        <div className="auth-page">
            <div className="auth-box standard-theme">
                <h2 className="auth-header blue-glow">[ SYSTEM AUTHENTICATION ]</h2>
                <p className="auth-subtitle">Verify Hunter Credentials</p>

                <div className="auth-form">
                    <input 
                        type="text" 
                        className="system-input input-blue" 
                        placeholder="Hunter Name" 
                        onChange={(e)=>setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        className="system-input input-blue" 
                        placeholder="Password" 
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    
                    <button className="btn-enter auth-btn" onClick={handleLogin}>
                        ENTER SYSTEM
                    </button>
                </div>

                <div className="auth-redirect">
                    <p>Unregistered? <span style={{cursor: 'pointer'}} onClick={() => navigate("/register")}>Awaken Here</span></p>
                </div>
                
                {notification.message && (
                    <SystemAlert message={notification.message} error={notification.error} />  
                )}
            </div>
        </div>
    )
}