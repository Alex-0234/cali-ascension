import styles from '../../styles/dashboard.module.css'

export default function Header({logout}) {
    

    return (
            <header className={`${styles.dashboardHeader}`}>
                <h2>Dashboard</h2>
                <button className={`${styles.btnLogout}`} onClick={logout}>Logout</button>
            </header>
    )
}