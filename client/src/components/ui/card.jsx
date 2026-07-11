

export default function Card({children, name=null, bg = false, contTWCSS='h-fit w-full', TWCSS}) {

    return (
           <section className={`block  ${contTWCSS}`}>

                {name && (
                    <div className="flex items-center gap-3 p-2 text-xs tracking-widest text-text-main uppercase mb-4">
                        <span className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_6px_#34d399b3]"></span>
                        <span>System.{name}</span>
                        <span className="flex-1 h-px bg-border-subtle"></span>
                    </div>
                    )}
                {bg ? (
                        <section className={`border-cyan-500/20 bg-slate-900/60 rounded-sm p-1 ${TWCSS}`}>
                            {children}
                        </section>
                ) : (
                        <section className={`${TWCSS}`}>
                            {children}
                        </section>
                )}
            

               
            </section>
    )
}