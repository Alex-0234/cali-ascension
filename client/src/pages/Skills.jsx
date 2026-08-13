import { Navigate, useParams, useSearchParams } from 'react-router-dom';

import { ALL_EXERCISES } from '../data/exercise_db';
import SkillTree from '../components/skilltree/SkillTree';

const CATEGORIES = Object.keys(ALL_EXERCISES);

/**
 * The tree's category and selected node live in the URL, so a node can be linked
 * to directly — the locked exercise cards in a session point straight at it.
 */
export default function Skills() {
    const { category } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    if (!category || !CATEGORIES.includes(category)) {
        return <Navigate to={`/skills/${CATEGORIES[0]}`} replace />;
    }

    const selectedId = searchParams.get('node');

    const setSelectedId = (nodeId) => {
        setSearchParams(
            (params) => {
                if (nodeId) params.set('node', nodeId);
                else params.delete('node');
                return params;
            },
            { replace: true }
        );
    };

    return (
        <SkillTree
            categories={CATEGORIES}
            category={category}
            selectedId={selectedId}
            onSelect={setSelectedId}
        />
    );
}
