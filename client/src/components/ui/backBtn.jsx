

const BackButton = ({onClick, position, align, top, right}) => {

    return (

        <button  onClick={onClick} style={{position: position, placeSelf: align, background: 'transparent', border: 'none', top: top, right: right }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
            </svg>
        </button>
    )
}

export default BackButton;