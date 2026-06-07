import {useState, useEffect} from 'react';
import useTerminalData from '../../store/terminalStore'

const StatusPanel = ({terminalOn}) => {
    // const userData = 
    const isTyping = useTerminalData((state) => state.isTyping);
    const [status, setStatus] = useState('offline');
    const [activity, setActivity] = useState('unidentified');
    const [trackedUser, setTrackedUser] = useState('unknown');

    useEffect(() => {
        if (terminalOn) {
            setStatus('online');
            isTyping ? setActivity('is typing') : setActivity('Idle');
        }
    },[terminalOn, isTyping])

    return (
        <div className={'wrapper'} style={{
            overflow: 'hidden',
        }}>

            <div style={{
                display: 'grid',
                marginTop: '1rem',
                gridTemplateRows: '1fr 1fr',

                height: 'auto',
                width: '80%',
                fontFamily: 'var(--font-normal)'
                
            }}>
                <p style={{margin: '0', gridColumn: 1}}>status </p>
                <p style={{margin: '0', gridColumn: '2'}}>{status}</p>
                <p style={{margin: '0', gridColumn: 1}}>activity </p>
                <p style={{margin: '0', gridColumn: '2'}}>{activity}</p>                
                <p style={{margin: '0', gridColumn: 1}}>tracked user</p>
                <p style={{margin: '0', gridColumn: '2'}}>{trackedUser}</p>
            </div>

            <div style={{marginTop: '1rem', height: '1px', width: '100%', background: 'var(--color-highlight)'}}></div>
        </div>
    )
}
export default StatusPanel;