  

const CloseButton = ({onClose, position, align, top, right,  size = 24}) => {

    return (

        <button  onClick={onClose} style={{position: position, placeSelf: align, background: 'transparent', border: 'none', top: top, right: right }}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={size} 
                height={size} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke={`var(--text-main)`} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
            </svg>
        </button>
    )
}

export default CloseButton;