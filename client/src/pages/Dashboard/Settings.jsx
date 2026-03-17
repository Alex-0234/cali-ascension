
import { useState } from 'react';
import useUserStore from '../../store/usePlayerStore';

import SystemButton from '../../components/ui/systemBtn';
import EditBtn from '../../components/ui/editBtn';
import CloseButton from '../../components/ui/closeBtn';

import styles from '../../styles/layout.module.css'


export default function Settings() {
    const userData = useUserStore((state) => state.userData);
    const setUserData = useUserStore((state) => state.setUserData);

    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState(null);
    const [newValue, setNewValue] = useState("");
    
    const allMainFields = ['username','email','password'];
    const allSecondaryFields = ['shownName','gender','age',];
    

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
            <h3> Currently in development... </h3>
            <div className={`${styles.profileInfo} generic-border`}>

                {allMainFields.map((field, index) => {
                    return (
                    	<div key={index}>
                            <label htmlFor={`settings_${field}`}> {field}: </label>

                            { field !== 'password' && (
                                <input name={field} id={`settings_${field}`} value={`[ ${userData[field]} ]`} readOnly={true} style={{display: 'flex', width: 'auto'}}/>
                            )     
                            }
                            <EditBtn onClick={() => handleEdit(field)} /> 
                        </div> 
                    )
                })
                }
                {allSecondaryFields.map((field, index) => {
                    return (
                    	<div key={index}>
                            <label htmlFor={`settings_${field}`}> {field}: </label>
                            <input name={field} id={`settings_${field}`} value={`[ ${userData[field]} ]`} readOnly={true} style={{display: 'flex', width: 'auto'}}/>   
                            <EditBtn onClick={() => handleEdit(field)} /> 
                        </div> 
                    )
                })
                }


                {isEditing && editField && (
                    <div style={{ zIndex: 1000, height: 'auto', width: '300px', position: 'absolute',top: '10rem', padding: '1rem', background: 'var(--bg-panel-a)', backdropFilter: 'blur(16px)'}}>
                        <h2>Edit {editField}</h2>
                        <div className='btn-close' onClick={() => setIsEditing(false)}>X</div>
                        <div className="edit-field generic-border">
                            <input type="text" placeholder={`Enter new ${editField}`} onChange={(e) => setNewValue(e.target.value)} />
                            <SystemButton /* className="save-btn" */ text={'Save'} onClick={() => handleSave()} />
                        </div>
                    </div>
                )}        
            </div>
        </>
    )
}