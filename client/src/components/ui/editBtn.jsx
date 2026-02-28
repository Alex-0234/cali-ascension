

export default function EditBtn({ onClick, toChange }) {
    return (
        <button className="edit-btn" onClick={onClick}>
            Edit {toChange}
        </button>
    )
}