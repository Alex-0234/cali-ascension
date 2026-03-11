import { useState } from 'react'

import useUserStore from '../../store/usePlayerStore'

import SystemButton from '../ui/systemBtn'

const CustomTracker = () => {
    const { userData, setUserData } = useUserStore();


    const activeTrackers = userData.activeTrackers || []; // Maybe join together with trackers state
    const [trackers, setTrackers] = useState(activeTrackers.length);
    const [value, setValue] = useState('');

    const handleChange = (value) => {
        setValue(value);

    }

    const handleSubmit = () => {
        if (!value || value === '') return;

        setUserData({
            ...userData,
            activeTrackers: activeTrackers, value
        })

        setTrackers(prev => prev + 1);
        setValue('');
    }

    return (
        <div>

            <form>
                <label for='trackerInput'>What do you want to track?</label>
                <input id='trackerInput' type='text' onChange={handleChange(e.target.value)}></input>

                <SystemButton text='Submit' onClick={() => handleSubmit()}/>
            
            </form>

            <div>
                {activeTrackers.map((tracker, index) => {
                    // tracker = { type: 'check', }
                })}
            </div>

        </div>
    )
}
export default CustomTracker;

