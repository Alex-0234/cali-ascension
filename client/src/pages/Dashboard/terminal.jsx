import {useState, useEffect} from 'react';

import useUserStore from '../../store/usePlayerStore';
import useTerminalStore from '../../store/terminalStore';

import Typewriter from '../../components/ui/typewriter';
import Message from '../../components/ui/message';
import StatusPanel from '../../components/ui/terminal_status';

const Terminal = ({content}) => {
    const {userData, syncUser, fetchUser} = useUserStore();
    const {terminalData, setTerminalData} = useTerminalStore();

    const [isServerReady, setIsServerReady] = useState(false);
    const [terminalOn, setTerminalOn] = useState(false);
    const [clearReset, setClearReset] = useState(false);
    const [introductionDone, setIntroductionDone] = useState(false);

    const introArray = ['>  Connection Succesfull', '>  Starting Terminal', '>  Terminal is Online', '> clear']
    const [introIndex, setIntroIndex] = useState(-1);
    const [startIntro, setStartIntro] = useState(false);

    useEffect(() => {
        if (!isServerReady) {

            const serverPing = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`);
                    if (response.ok) {
                        setIsServerReady(true);
                        setStartIntro(true);
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

    // FUNCTIONS
    

    return (
        <div style={{
            position: 'relative',
            background: 'rgba(0,0,0,0)',
            border: '1px solid var(--color-highlight)',
            borderRadius: '0.5rem',
            height: '80%',
            width: '80%',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'center',
            fontFamily: 'var(--pixel)',
            color: 'var(--color-highlight)',
        }}>
            {/* HEADER SECTION */}
            <section style={{
                position: 'absolute',
                top: '0',
                width: '100%',
                height: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-highlight)',
                fontFamily: 'var(--font-normal)',

            }}>
                <p style={{marginLeft: '1rem',}}>GENESIS-OS 2.0</p>
                <p style={{marginRight: '1rem',}}>X</p>
            </section>

            {/* CUTOFF SECTION */}
            <section style={{
                width: '80%',
                height: '100%',
                overflow: 'hidden',
            }}>

                {/* SCROLL SECTION */}
                <div className={'hide-scrollbar'} style={{
                    height: '100%',
                    width: '100%',
                    overflowY: 'scroll',
                }}>
                    {/* TERMINAL TOP SECTION */}
                    <div style={{
                        width: '100%',
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
                            justifyContent: 'space-between',

                        }}> <span>------</span> <span>GENESIS-OS 2.0</span> · <span>ACCESS {isServerReady ? 'GRANTED' : 'DENIED'}</span> · <span>TERMINAL {terminalOn ? 'ONLINE' : 'OFFLINE'}</span>   <span>------</span>   </p>

                        <StatusPanel terminalOn={terminalOn} />

                        {!clearReset &&
                        <p  key={0} style={{
                                margin: '0',
                                marginTop: '0.5rem',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-normal)'
                            }}>
                            &#62;  Connecting to the GENESIS server.                 
                            </p>
                        
                        }
                        {!clearReset && startIntro && introIndex >= 0 && introArray.slice(0, introIndex + 1).map((line, index) => (
                            <p key={index} style={{
                                margin: '0',
                                marginTop: '0.5rem',
                                fontSize: '0.8rem',
                                fontFamily: 'var(--font-normal)'
                            }}>
                                <Typewriter text={line} speed={30}/>
                            </p>
                        ))}
                        
                    </div>
                    {/* CONTENT SECTION */}
                    <div style={{
                        marginTop: '1rem',
                        minWidth: '80%',
                        width: '100%',
                        height: '100%',
                        fontFamily: 'var(--font-normal)'
                    }}>
                        {clearReset && 
                        !userData.userId && 
                        !introductionDone &&
                        <Message scenario={'introduceTerminal'}/>  }

                        {clearReset &&
                        !userData.userId &&
                        introductionDone &&
                        <Message scenario={'alertLogin'} />
                        }

                        {clearReset && userData.userId && content}
                    </div>
                </div>
            </section>
            
        </div>
    )
}

export default Terminal;