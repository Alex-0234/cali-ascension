


export default function Grid({children, gridTWCSS='grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}) {

    return (
        <div className={`grid ${gridTWCSS} p-2 sm:p-4 md:p-6 lg:p-8 gap-10 bg-card`}>
            {children}
        </div>
    )
}