

const SystemButton = ({text, onClick}) => {
    return (
        <button className='generic-btn' onClick={onClick}>
            {`${text}`}
        </button>
    )
}

export default SystemButton;