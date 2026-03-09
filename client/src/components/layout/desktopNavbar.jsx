import useUserStore from "../../store/usePlayerStore";
import { useNavigate, useLocation } from "react-router";

import styles from '../../styles/status.module.css'

export default function SystemSidebar() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const logout = useUserStore((state) => state.logout);

    const isActive = (path) => location.pathname === path;

    return (
        <>
        <nav className={styles.windowNav}>
            <div className={styles.navHeaderBrand}>[ SYSTEM ]</div>

            <div 
                className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
                onClick={() => navigate('/')}> Status
            </div>
            
            <div 
                className={`${styles.navItem} ${isActive('/workout') ? styles.active : ''}`}
                onClick={() => navigate('/workout')}> Training
            </div>
            
            <div 
                className={`${styles.navItem} ${isActive('/skill-tree') ? styles.active : ''}`}
                onClick={() => navigate('/skill-tree')}> Skill Tree
            </div>

            <div 
                className={styles.navItem} 
                style={{ marginTop: 'auto', color: '#ef4444' }}
                onClick={logout}> Logout
            </div>
        </nav>
        </>
    );
}