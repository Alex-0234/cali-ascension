import styles from '../../styles/layout.module.css'

export default function Header({logout, navigate}) {
    

    return (
            <header className={`${styles.dashboardHeader}`}>
                <button className={`${styles.settings}`} onClick={navigate}>Settings</button>
                <button className={`${styles.btnLogout}`} onClick={logout}>Logout</button>
            </header>
    )
}