import { useState } from 'react';
import useUserStore from '../../store/usePlayerStore';

import SystemButton from '../../components/ui/systemBtn';
import EditBtn from '../../components/ui/editBtn';
import CloseButton from '../../components/ui/closeBtn';

import styles from '../../styles/settings.module.css';

export default function Settings() {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);

    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState(null);
    const [newValue, setNewValue] = useState("");
    
    const allMainFields = ['username', 'email', 'password'];
    const allSecondaryFields = ['shownName', 'gender', 'age'];
    
    const handleEdit = (field) => {
        setEditField(field);
        setNewValue(""); 
        setIsEditing(true);
    }

    const handleSave = () => {
        if (!newValue.trim()) {
            alert("Value cannot be empty!");
            return;
        }
        setUserData({ ...userData, [editField]: newValue });
        setEditField(null);
        setIsEditing(false);
    }

    return (
        <div className={styles.settingsContainer}>
            <div className={styles.headerArea}>
                <h2 className={styles.pageTitle}>System Settings</h2>
                <span className={styles.devBadge}>v_development</span>
            </div>

            <div className={styles.settingsGrid}>
                {/* ACCOUNT DETAILS SECTION */}
                <div className={styles.settingsSection}>
                    <h3 className={styles.sectionTitle}>Account Details</h3>
                    <div className={styles.cardList}>
                        {allMainFields.map((field, index) => (
                            <div key={index} className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <label className={styles.settingLabel} htmlFor={`settings_${field}`}>
                                        {field}
                                    </label>
                                    <input 
                                        className={styles.settingInputReadonly}
                                        name={field} 
                                        id={`settings_${field}`} 
                                        value={field === 'password' ? "********" : userData[field] || "Not set"} 
                                        readOnly={true} 
                                    />
                                </div>
                                <div className={styles.settingAction}>
                                    <EditBtn onClick={() => handleEdit(field)} /> 
                                </div>
                            </div> 
                        ))}
                    </div>
                </div>

                {/* PLAYER PROFILE SECTION */}
                <div className={styles.settingsSection}>
                    <h3 className={styles.sectionTitle}>Player Profile</h3>
                    <div className={styles.cardList}>
                        {allSecondaryFields.map((field, index) => (
                            <div key={index} className={styles.settingRow}>
                                <div className={styles.settingInfo}>
                                    <label className={styles.settingLabel} htmlFor={`settings_${field}`}>
                                        {field === 'shownName' ? 'Display Name' : field}
                                    </label>
                                    <input 
                                        className={styles.settingInputReadonly}
                                        name={field} 
                                        id={`settings_${field}`} 
                                        value={userData[field] || "Not set"} 
                                        readOnly={true} 
                                    />   
                                </div>
                                <div className={styles.settingAction}>
                                    <EditBtn onClick={() => handleEdit(field)} /> 
                                </div>
                            </div> 
                        ))}
                    </div>
                </div>
            </div>

            {/* EDIT MODAL OVERLAY */}
            {isEditing && editField && (
                <div className={styles.modalOverlay}>
                    <div className={styles.editModal}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                Edit <span className={styles.highlightText}>{editField === 'shownName' ? 'Display Name' : editField}</span>
                            </h3>
                            <CloseButton onClose={() => setIsEditing(false)} />
                        </div>
                        
                        <div className={styles.modalBody}>
                            <input 
                                className={styles.modalInput}
                                type={editField === 'password' ? "password" : "text"} 
                                placeholder={`Enter new ${editField}`} 
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.btnCancel} onClick={() => setIsEditing(false)}>Cancel</button>
                            <SystemButton text={'Save Changes'} onClick={handleSave} />
                        </div>
                    </div>
                </div>
            )}        
        </div>
    )
}