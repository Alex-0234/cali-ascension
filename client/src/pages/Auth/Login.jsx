import { useState } from 'react'
import { useNavigate } from 'react-router-dom'; 
import useUserStore from '../../store/usePlayerStore'

export default function Login() {
    const navigate = useNavigate();
    const login = useUserStore((state) => state.login); 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [notification, setNotification] = useState({ message: "", error: false });

    async function handleLogin() {
        try {
            if (!email || !password) {
                setNotification({ message: "System Error: Credentials required", error: true });
                return;
            }

            // Zde zavoláš svou login logiku (fetch nebo funkci ze storu)
            // Tohle je placeholder pro ukázku
            const success = await login(email, password); 
            
            if (success) {
                setNotification({ message: "Authentication successful...", error: false });
                setTimeout(() => navigate('/'), 1000);
            } else {
                setNotification({ message: "Access Denied: Invalid credentials", error: true });
            }
        } catch (error) {
            setNotification({ message: "Server connection failed.", error: true });
        }
    }

    return (
        <div className="auth-page">
            {/* Standardní systémový kontejner pro login */}
            <div className="auth-box standard-theme">
                <h2 className="auth-header blue-glow">[ SYSTEM AUTHENTICATION ]</h2>
                <p className="auth-subtitle">Verify Hunter Credentials</p>

                <div className="auth-form">
                    <input 
                        type="email" 
                        className="system-input input-blue" 
                        placeholder="Email Address" 
                        onChange={(e)=>setEmail(e.target.value)}
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
                    <p>Unregistered? <span onClick={() => navigate("/register")}>Awaken Here</span></p>
                </div>
                
                {notification.message && (
                    <Notification message={notification.message} error={notification.error} />  
                )}
            </div>
        </div>
    )
}