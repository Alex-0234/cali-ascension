import { useId } from 'react';

const CONTROL_CLASSES =
    'w-full rounded-sm border border-border-main bg-card px-3 py-2.5 text-sm text-text-bright ' +
    'placeholder:text-text-muted/60 transition-colors focus:border-accent focus:outline-none ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

/**
 * Labelled form control. Every input in the app goes through here so labels are
 * always wired to their control and error text always lands in the same place.
 */
export default function Field({ label, hint, error, children, ...inputProps }) {
    const generatedId = useId();
    const id = inputProps.id || generatedId;
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[10px] tracking-widest text-text-muted uppercase">
                {label}
            </label>

            {children
                ? children({ id, className: CONTROL_CLASSES, 'aria-describedby': describedBy })
                : (
                    <input
                        {...inputProps}
                        id={id}
                        aria-describedby={describedBy}
                        aria-invalid={error ? true : undefined}
                        className={`${CONTROL_CLASSES} ${error ? 'border-danger' : ''} ${inputProps.className || ''}`}
                    />
                )}

            {hint && !error && (
                <p id={`${id}-hint`} className="text-[10px] text-text-muted">{hint}</p>
            )}
            {error && (
                <p id={`${id}-error`} className="text-[10px] text-danger">{error}</p>
            )}
        </div>
    );
}
