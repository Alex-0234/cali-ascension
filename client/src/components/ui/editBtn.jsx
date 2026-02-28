

export default function EditBtn({ onClick, toChange }) {
    return (
        <button className="edit-btn generic-btn" onClick={onClick}>
            Edit {toChange}
        </button>
    )
}