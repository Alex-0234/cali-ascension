import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useUserStore, { WEIGHT_TRACKER_NAME } from '../store/usePlayerStore';
import Panel from '../components/ui/panel';
import Field from '../components/ui/field';
import ConfirmDialog from '../components/ui/confirmDialog';
import { LogoutIcon } from '../components/ui/icons';

const COLORS = ['#22d3ee', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6'];

function ReadOnlyRow({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-border-subtle py-3 last:border-b-0">
            <span className="text-[10px] tracking-widest text-text-muted uppercase">{label}</span>
            <span className="truncate text-sm text-text-bright">{value || '—'}</span>
        </div>
    );
}

export default function Settings() {
    const navigate = useNavigate();
    const { userData, setUserData, syncUser, logout, deleteAccount } = useUserStore();

    const [form, setForm] = useState(() => ({
        visibleName: userData.userInfo?.visibleName ?? '',
        age: userData.userInfo?.age ?? '',
        gender: userData.userInfo?.gender ?? '',
        height: userData.userInfo?.height ?? '',
    }));
    const [color, setColor] = useState(userData.color || COLORS[0]);
    const [saved, setSaved] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [dataError, setDataError] = useState('');

    const update = (key) => (event) => {
        setForm((prev) => ({ ...prev, [key]: event.target.value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setUserData({
            color,
            userInfo: {
                ...userData.userInfo,
                visibleName: form.visibleName.trim() || null,
                age: Number(form.age) || null,
                gender: form.gender || null,
                height: Number(form.height) || null,
            },
        });
        await syncUser();
        setSaved(true);
    };

    const handleLogout = async () => {
        // Logging out clears the store, so anything still queued has to go first.
        if (useUserStore.getState().isDirty) await syncUser();
        await logout();
        navigate('/login', { replace: true });
    };

    // Exported straight from the server rather than the store, so the file is
    // everything actually held on the account, not just what this tab has loaded.
    const handleExport = async () => {
        setDataError('');
        try {
            if (useUserStore.getState().isDirty) await syncUser();

            const response = await fetch('/api/user/me', { credentials: 'include' });
            if (!response.ok) throw new Error('Export failed');

            const url = URL.createObjectURL(
                new Blob([JSON.stringify(await response.json(), null, 2)], { type: 'application/json' })
            );
            const link = document.createElement('a');
            link.href = url;
            link.download = `cali-ascension-${userData.username || 'account'}-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            setDataError('Could not export your data. Try again in a moment.');
        }
    };

    const handleDelete = async () => {
        setConfirmDelete(false);
        setDataError('');

        if (await deleteAccount()) navigate('/login', { replace: true });
        else setDataError('Could not delete the account. Try again in a moment.');
    };

    const joined = userData.dateCreated
        ? new Date(userData.dateCreated).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : null;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">

            <header>
                <h1 className="text-lg tracking-wide text-text-bright">Settings</h1>
                <p className="text-xs text-text-muted">Profile details used across the interface.</p>
            </header>

            <Panel label="profile">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Display name"
                        placeholder={userData.username}
                        hint="Shown instead of your username."
                        value={form.visibleName}
                        onChange={update('visibleName')}
                    />

                    <Field label="Gender" value={form.gender} onChange={update('gender')}>
                        {(props) => (
                            <select {...props} value={form.gender} onChange={update('gender')}>
                                <option value="">Not set</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        )}
                    </Field>

                    <Field
                        label="Age"
                        type="number"
                        min="0"
                        placeholder="25"
                        value={form.age}
                        onChange={update('age')}
                    />

                    <Field
                        label="Height (cm)"
                        type="number"
                        min="0"
                        placeholder="180"
                        value={form.height}
                        onChange={update('height')}
                    />
                </div>

                <div className="mt-5 flex flex-col gap-2">
                    <span className="text-[10px] tracking-widest text-text-muted uppercase">Accent</span>
                    <div className="flex flex-wrap gap-2">
                        {COLORS.map((option) => (
                            <button
                                key={option}
                                type="button"
                                aria-label={`Accent ${option}`}
                                aria-pressed={color === option}
                                onClick={() => { setColor(option); setSaved(false); }}
                                style={{ backgroundColor: option }}
                                className={`h-7 w-7 cursor-pointer rounded-full transition-transform ${
                                    color === option ? 'ring-2 ring-text-bright ring-offset-2 ring-offset-panel' : 'hover:scale-110'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="cursor-pointer rounded-sm border border-accent/50 bg-accent/10 px-5 py-2.5 text-xs tracking-widest text-accent-light uppercase transition-colors hover:bg-accent/20"
                    >
                        Save changes
                    </button>
                    {saved && <span className="text-xs text-success">Saved.</span>}
                </div>
            </Panel>

            <Panel label="account">
                <ReadOnlyRow label="Username" value={userData.username} />
                <ReadOnlyRow label="E-mail" value={userData.email} />
                <ReadOnlyRow label="Member since" value={joined} />
                <ReadOnlyRow label="Weight" value={userData.userInfo?.weight ? `${userData.userInfo.weight} kg` : null} />

                <p className="mt-3 text-[11px] leading-relaxed text-text-muted">
                    Weight is owned by the {WEIGHT_TRACKER_NAME} tracker so its history stays intact — update it
                    from the <Link to="/" className="text-accent-light hover:underline">dashboard</Link>.
                </p>
            </Panel>

            <Panel label="session">
                <button
                    type="button"
                    onClick={() => setConfirmLogout(true)}
                    className="flex cursor-pointer items-center gap-2 rounded-sm border border-border-main px-4 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:border-danger/50 hover:text-danger"
                >
                    <LogoutIcon /> Sign out
                </button>
            </Panel>

            <Panel label="your_data">
                <div className="flex flex-col gap-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-sm text-text-bright">Export your data</p>
                            <p className="text-[11px] leading-relaxed text-text-muted">
                                Downloads everything held on your account as JSON — profile, trackers,
                                unlocks and full workout history.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleExport}
                            className="shrink-0 cursor-pointer rounded-sm border border-border-main px-4 py-2.5 text-xs tracking-wider text-text-main uppercase transition-colors hover:border-accent/50 hover:text-accent-light"
                        >
                            Download
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-5">
                        <div className="min-w-0">
                            <p className="text-sm text-danger">Delete account</p>
                            <p className="text-[11px] leading-relaxed text-text-muted">
                                Permanently erases your account and every workout, tracker and unlock
                                on it. This cannot be undone.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(true)}
                            className="shrink-0 cursor-pointer rounded-sm border border-danger/50 bg-danger/10 px-4 py-2.5 text-xs tracking-wider text-danger uppercase transition-colors hover:bg-danger/20"
                        >
                            Delete
                        </button>
                    </div>

                    {dataError && <p className="text-xs text-danger" role="alert">{dataError}</p>}
                </div>
            </Panel>

            <ConfirmDialog
                open={confirmLogout}
                title="Sign out"
                body="Unsaved changes are pushed before the session ends."
                confirmLabel="Sign out"
                tone="danger"
                onConfirm={handleLogout}
                onCancel={() => setConfirmLogout(false)}
            />

            <ConfirmDialog
                open={confirmDelete}
                title="Delete account permanently"
                body="Your account and every workout, tracker and unlock on it will be erased the moment you confirm. There is no recovery window. Export a copy first if you want to keep it."
                phrase={`delete user ${userData.username}`}
                confirmLabel="Delete this account"
                tone="danger"
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(false)}
            />
        </div>
    );
}
