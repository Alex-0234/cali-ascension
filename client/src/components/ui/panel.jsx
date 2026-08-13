/**
 * The single surface primitive: an optional labelled rule, then a bordered box.
 *
 * Replaces the old Card's pass-through class props (`contTWCSS` / `TWCSS` / `bg`),
 * which let every caller invent its own padding and border and made the panels
 * drift apart visually.
 */
export default function Panel({
    label,
    action,
    flush = false,
    bare = false,
    className = '',
    bodyClassName = '',
    children,
}) {
    return (
        <section className={className}>
            {(label || action) && (
                <div className="mb-3 flex items-center gap-3">
                    {label && (
                        <>
                            <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_6px_#34d399b3]" />
                            <span className="text-[10px] tracking-widest text-text-main uppercase">System.{label}</span>
                        </>
                    )}
                    <span className="h-px flex-1 bg-border-subtle" />
                    {action}
                </div>
            )}

            {/* `bare` drops the box rather than trying to undo it with overrides —
                competing Tailwind utilities resolve by stylesheet order, not by
                the order they appear in the class attribute. */}
            {bare ? children : (
                <div className={`rounded-sm border border-border-subtle bg-panel/50 ${flush ? '' : 'p-5'} ${bodyClassName}`}>
                    {children}
                </div>
            )}
        </section>
    );
}

/** Section heading used inside a panel, where a full panel header would be too loud. */
export function PanelHeading({ children, action }) {
    return (
        <div className="mb-3 flex items-center gap-3">
            <span className="text-[10px] tracking-widest whitespace-nowrap text-text-muted uppercase">{children}</span>
            <span className="h-px flex-1 bg-border-subtle" />
            {action}
        </div>
    );
}
