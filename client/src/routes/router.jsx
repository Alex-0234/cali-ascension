import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import RootLayout from '../layouts/RootLayout';
import AppShell from '../layouts/AppShell';
import AuthLayout from '../layouts/AuthLayout';
import WorkoutLayout from '../layouts/WorkoutLayout';
import { RequireAuth, RequireCalibration, RequireGuest } from './guards';

import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Onboarding from '../pages/Onboarding';
import Dashboard from '../pages/Dashboard';
import History from '../pages/History';
import Settings from '../pages/Settings';
import WorkoutSetup from '../pages/WorkoutSetup';
import WorkoutSession from '../pages/WorkoutSession';
import RoutineBuilder from '../pages/RoutineBuilder';
import NotFound from '../pages/NotFound';

// The tree pulls in the whole React Flow renderer — keep it out of the initial
// bundle so the dashboard isn't paying for a screen most loads never open.
const Skills = lazy(() => import('../pages/Skills'));

const skillsElement = (
    <Suspense
        fallback={
            <div className="flex h-64 items-center justify-center font-robotomono text-xs tracking-widest text-text-muted uppercase">
                Loading module…
            </div>
        }
    >
        <Skills />
    </Suspense>
);

/**
 * Route map. Every screen is addressable, so the browser's back button, refresh
 * and deep links all behave — the previous build swapped screens with a piece of
 * state in a parent component, which none of those could see.
 */
const router = createBrowserRouter([
    {
        element: <RootLayout />,
        errorElement: <NotFound asError />,
        children: [
            {
                element: <RequireGuest />,
                children: [
                    {
                        element: <AuthLayout />,
                        children: [
                            { path: 'login', element: <Login /> },
                            { path: 'register', element: <Register /> },
                        ],
                    },
                ],
            },
            {
                element: <RequireAuth />,
                children: [
                    { path: 'onboarding', element: <Onboarding /> },
                    {
                        element: <RequireCalibration />,
                        children: [
                            {
                                element: <AppShell />,
                                children: [
                                    { index: true, element: <Dashboard /> },
                                    { path: 'history', element: <History /> },
                                    { path: 'settings', element: <Settings /> },
                                    // Bare /skills falls through to the page, which
                                    // redirects to the first category.
                                    { path: 'skills', element: skillsElement },
                                    { path: 'skills/:category', element: skillsElement },
                                    {
                                        path: 'workout',
                                        element: <WorkoutLayout />,
                                        children: [
                                            { index: true, element: <WorkoutSetup /> },
                                            { path: 'session', element: <WorkoutSession /> },
                                            { path: 'routines/new', element: <RoutineBuilder /> },
                                            { path: 'routines/:name', element: <RoutineBuilder /> },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            { path: '*', element: <NotFound /> },
        ],
    },
]);

export default router;
