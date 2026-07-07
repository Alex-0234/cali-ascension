import { useState } from 'react'

import useUserStore from '../../store/usePlayerStore'

export default function Login() {
    const { fetchUser } = useUserStore(); 
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const [mode, setMode] = useState('Username');  


    async function handleLogin(e) {
        if (e) e.preventDefault();
        
        try {
            if ((!username && !email) || !password) {
               //
                return;
            }

            setTimeout(() => {
                if (password === "admin") {

                    //
                } else {
                    //
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
                    //
            } else {
                //
            }

        } catch (error) {
            console.error("Login error:", error);
            //
        }
    }

   return (
        <>
        <div >

                <div >
                    <h1 >CALISTHENICS<br/>ASCENSION</h1>
                    <p >Calisthenics helper</p>
                </div>
                

            <div >
                <div >
                    
                    <h2 >[ SYSTEM_AUTH ]</h2>
                    <p >Verify Hunter Credentials</p>

                    <div >
                        <button  onClick={() => setMode('Username')}>
                            Username
                        </button>
                        <button  onClick={() => setMode('E-mail')}>
                            E-mail
                        </button>
                    </div>

                    <form >
                        {mode === 'Username' ? (
                            <div >
                                <label >Hunter Name</label>
                                <input autoComplete='username' type="text"  placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        ) : (
                            <div >
                                <label >Secure E-mail</label>
                                <input autoComplete='email' type="email"  placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        )}

                        <div >
                            <label >Access Code</label>
                            <input autoComplete="current-password" type="password"  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        
                        <button  onClick={handleLogin}>
                            Initialize
                        </button>
                    </form>

                    <div >
                        <p>Unregistered? <span>Awaken Here</span></p>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}