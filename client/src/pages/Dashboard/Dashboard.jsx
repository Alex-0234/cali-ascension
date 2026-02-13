
import useUserStore from '../../store/usePlayerStore'

import StatusWindow from './StatusWindow';
import Navbar from '../../components/layout/Navbar';

export default function Dashboard() {
    const userData = useUserStore((state) => state.userData);
    const logout = useUserStore((state) => state.logout);  

    if (userData.isLoading) {
        return <div className="dashboard">Loading System...</div>;
    }

    return (
        <>
        <button onClick={logout}>Logout</button>
        <div className='dashboard'>
            <h2>Dashboard</h2>
            <StatusWindow />
        </div>
        <Navbar />
        </>
    )
}