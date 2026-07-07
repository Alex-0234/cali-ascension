import { useState } from 'react'

import validatePassword from '../../utils/validatePassword';


export default function Register() {
 
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
        <div>
            <div>
                
                <h2>[ NEW AWAKENING ]</h2>
                <p>Register new Hunter to the System</p>

                <form>
               
                    <div>
                        <label htmlFor='username' >Username</label>
                        <input 
                            type="text" 
                            id='username'
                            placeholder="Enter Hunter Name" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete='username' />
                    </div>

                    <div>
                        <label htmlFor='email'>E-mail</label>
                        <input 
                            type="email" 
                            id='email'
                            placeholder="Enter E-mail Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete='email' />
                    </div>

                    <div>
                        <label htmlFor='password'>Password</label>
                        <input 
                            type="password" 
                            id='password'
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete='new-password' />
                    </div>

                    <div>
                        <label htmlFor='confirmPassword'>Verify Password</label>
                        <input 
                            type="password" 
                            id='confirmPassword'
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete='new-password' />
                    </div>
                    
                    <button onClick={handleRegister}>
                        INITIALIZE HUNTER
                    </button>
                </form>

                <div>
                    <p>Already awakened? <span>Access System</span></p>
                </div>

            </div>
        </div>
        </>
    )
}