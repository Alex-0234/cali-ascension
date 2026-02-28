
import { useState } from 'react';
import useUserStore from '../../stores/userStore';
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
        {isEditing && (
            <div style={{ zIndex: 1000, height: 'auto', width: '300px'}}>
                <h2>Edit {editField}</h2>
                <div className='btn-close' onClick={() => setIsEditing(false)}>X</div>
                <div className="edit-field generic-border">
                    <input type="text" placeholder={`Enter new ${editField}`} onChange={(e) => setNewValue(e.target.value)} />
                    <button className="save-btn" onClick={() => handleSave()}>Save</button>
                </div>
            </div>
        
        )}
            
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
                    <p><strong>Shown Username:</strong> {userData.shownUsername}</p>
                    <EditBtn onClick={() => handleEdit("shownUsername")} toChange="shown username" />
                </div>
                
            </div>
            <p>This feature is currently under development. Please check back later for updates!</p>
        </div>
        </>
    )
}