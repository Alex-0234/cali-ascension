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
                className={`${styles.navItem} ${isActive('/status') ? styles.active : ''}`}
                onClick={() => navigate('/status')}> Status
            </div>
            
            <div 
                className={`${styles.navItem} ${isActive('/workout') ? styles.active : ''}`}
                onClick={() => navigate('/workout')}> Training
            </div>
            
            <div 
                className={`${styles.navItem} ${isActive('/skill-tree') ? styles.active : ''}`}
                onClick={() => navigate('/skill-tree')}> Skill Tree
            </div>

            <div style={{marginTop: 'auto'}}>
                <div 
                    className={styles.navItem} 
                    style={{ color: '#444444' }}
                    onClick={() => navigate('/settings')}> Settings
                </div>

                <div 
                    className={styles.navItem} 
                    style={{ color: '#ef4444' }}
                    onClick={logout}> Logout
                </div>
            </div>
        </nav>
        </>
    );
}