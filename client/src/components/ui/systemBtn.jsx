
import styles from '../../styles/button.module.css'

const SystemButton = ({ style = 'genericBtn', text, onClick }) => {
    return (
        <button className={styles[style]} onClick={onClick}>
            {text}
        </button>
    )
}

export default SystemButton;