import useUserStore from '../../store/usePlayerStore';
import useUIStore from '../../store/useUIStore';

import { useState } from 'react';
import EditBtn from '../ui/editBtn';
import CloseButton from '../ui/closeBtn';

import styles from '../../styles/dashboard.module.css'


export default function EditProfileModal() {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);
    const setProfile = useUIStore((state) => state.setProfile);

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
        <div className={`${styles.profileModal}`} >
            <h2>Edit Profile</h2>
            <CloseButton onClose={() => setProfile(false)} position='absolute' align='center' top='20px' right='20px' size='30px'/>

            <div className={`${styles.profileInfo} generic-border`}>
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
                    <div style={{ zIndex: 1000, height: 'auto', width: '300px', position: 'absolute',top: '10rem', padding: '1rem'}}>
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