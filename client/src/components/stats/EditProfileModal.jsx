
import { useState } from 'react';
import useUserStore from '../../store/usePlayerStore';
import EditBtn from '../ui/editBtn';

export default function EditProfileModal({ onClose }) {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);

    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState(null);
    const [newValue, setNewValue] = useState("");
    

    const handleEdit = (field) => {
        setEditField(field);
        setIsEditing(true);
    }

    const handleSave = () => {
        setUserData({ ...userData, [editField]: newValue });
        setEditField(null);
        setIsEditing(false);

    }


    return (
        <>

        <div className="edit-profile-modal" style={{ zIndex: 1000}}>
            <h2>Edit Profile</h2>
            <div className='btn-close' onClick={onClose}>X</div>

            <div className="profile-info generic-border">
                <div>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <EditBtn onClick={() => handleEdit("username")} toChange="username" />
                </div>
                <div>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <EditBtn onClick={() => handleEdit("email")} toChange="email" />
                </div>
                <div>
                    <p><strong>Shown Username:</strong> {userData.shownName}</p>
                    <EditBtn onClick={() => handleEdit("shownName")} toChange="shown username" />
                </div>
                {isEditing && editField && (
                    <div style={{ zIndex: 1000, height: 'auto', width: '300px', position: 'absolute',top: '10rem', padding: '1rem'}} className="edit-field generic-border">
                        <h2>Edit {editField}</h2>
                        <div className='btn-close' onClick={() => setIsEditing(false)}>X</div>
                        <div className="edit-field generic-border">
                            <input type="text" placeholder={`Enter new ${editField}`} onChange={(e) => setNewValue(e.target.value)} />
                            <button className="save-btn" onClick={() => handleSave()}>Save</button>
                        </div>
                    </div>
                
                )}
                
            </div>
            <p>This feature is currently under development. Please check back later for updates!</p>
        </div>
        </>
    )
}