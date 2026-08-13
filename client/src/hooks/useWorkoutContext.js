import { useOutletContext } from 'react-router-dom';

/** Reads the training session WorkoutLayout hands down to its child routes. */
export default function useWorkoutContext() {
    return useOutletContext();
}
