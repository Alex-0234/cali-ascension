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
            if (username === undefined || email === undefined || password === undefined || confirmPassword === undefined) {
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
                body: JSON.stringify({ username: username, email: email, password: password }),
            });

            if (response.ok) {
                const data = await response.json();
                setNotification({ message: data.message, error: false });
                setTimeout(() => {
                    navigate('/login');
                }, 1500)
                
            }
            else {
                const errorData = await response.json();
                setNotification({ message: errorData.message, error: true });
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setNotification({ message: error.message, error: true });
        }
    }
    return (
        <>
        <h2>Sign Up</h2>
        <div className="register-form">
            <input type="text" styles={styles.input} placeholder="Username" onChange={(e)=>setUsername(e.target.value)}/>
            <input type="email" styles={styles.input} placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" styles={styles.input} placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
            <input type="password" styles={styles.input} placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
            <button onClick={handleRegister}>Sign Up</button>
        </div>
        <div className='signup-redirect'>
            <p>Already have an account? <a style={{cursor: 'pointer'}} onClick={() => navigate("/login")}>Log In</a></p>
        </div>
        {notification.message && (
            <Notification message={notification.message} error={notification.error} />  
        )}
        </>
    )

}