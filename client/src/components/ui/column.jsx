

export default function Column({children, name}) {

    return (
        <div className='columns-1 min-h-full h-auto w-full p-2 sm:p-4 md-p-6 lg:p-8 bg-card'>
            {name && (
                <div className="flex items-center gap-3 text-xs tracking-widest text-text-main uppercase mb-4">
                    <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                    <span>System.{name}</span>
                    <span className="flex-1 h-px bg-border-subtle"></span>
                </div>
            )}

            {children}
        </div>
    )
}