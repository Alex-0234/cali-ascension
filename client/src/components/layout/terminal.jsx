import {useState, useEffect} from 'react';
import Typewriter from '../ui/typewriter';

const Terminal = () => {
    const [isServerReady, setIsServerReady] = useState(false);
    const [terminalOn, setTerminalOn] = useState(false);
    const [clearReset, setClearReset] = useState(false);

    const introArray = ['>  Connecting to the GENESIS server.','>  Connection Succesfull', '>  Starting Terminal', '>  Terminal is Online', '> clear']
    const [introIndex, setIntroIndex] = useState(-1);
    // First intro line should start before connecting to the server...

    useEffect(() => {
        if (!isServerReady) {

            const serverPing = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);
                    if (response.ok) {
                        setIsServerReady(true);
                    }
                    else {
                        setTimeout(() => {
                            serverPing();
                        }, 3000)
                    }
                }
                catch {
                    setTimeout(serverPing, 3000);
                }
            }
            serverPing();
        }
    },[isServerReady])
    

    useEffect(() => {
        if (isServerReady) {
            setIntroIndex(0); 
        
            setTimeout(() => {
                setTerminalOn(true);
                setTimeout(() => {
                    setClearReset(true);
                }, 1000)
            }, 3000); 
        }
    }, [isServerReady]);

    useEffect(() => {
        if (introIndex >= 0 && introIndex < introArray.length) {
            const timer = setTimeout(() => {
                setIntroIndex((prev) => prev + 1);
            }, 1000);
            
            return () => clearTimeout(timer); 
        }
    }, [introIndex]);

    return (
        <div style={{
            background: 'rgba(0,0,0,0)',
            border: '1px solid var(--color-highlight)',
            borderRadius: '0.5rem',
            height: '80%',
            width: '80%',
            padding: '3rem',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: 'var(--pixel)',
            color: 'var(--color-highlight)',
        }}>
            <div style={{
                width: '70%',
                height: 'fit-content',

            }}>
                <h1 style={{
                display: 'inline-block',
                fontSize: '5rem',
                lineHeight: '4.5rem',
                margin: '0',

                }}>GENESIS</h1>
                <p style={{
                    fontFamily: 'var(--font-normal)',
                    fontSize: '0.5rem',
                    margin: '0',
                    maxWidth: 'calc(7*2.88rem)',
                    display: 'flex',
                    justifyContent: 'space-between'
                    
                }}> <span>------</span> <span>GENESIS-OS 2.0</span> · <span>ACCESS {isServerReady ? 'GRANTED' : 'DENIED'}</span> · <span>TERMINAL {terminalOn ? 'ONLINE' : 'OFFLINE'}</span>   <span>------</span>   </p>

                {!clearReset && introIndex >= 0 && introArray.slice(0, introIndex + 1).map((line, index) => (
                    <p key={index} style={{
                        margin: '0',
                        marginTop: '0.5rem',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-normal)'
                    }}>
                        <Typewriter text={line} speed={40} />
                    </p>
                ))}
            </div>

            
        </div>
    )
}

export default Terminal;