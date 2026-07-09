  

const CloseButton = ({onClose, color, position, align, top, right,  size = 24}) => {

    return (

        <button onClick={onClose} className='cursor-pointer' style={{position: position, placeSelf: align, background: 'transparent', border: 'none', top: top, right: right }}>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width={size} 
                height={size} 
                viewBox={`0 0 ${size} ${size}`}
                fill="none" 
                stroke={`${color}`} 
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