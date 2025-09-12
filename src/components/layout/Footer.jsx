export default function Footer(){
    const footer = `bg-gradient-to-br from-stone-700 to-stone-600
                    p-6 flex justify-center items-center`
    return(
        <footer className={footer}>
            <p className="text-lg text-amber-400">@goldDigger 2025</p>
        </footer>
    )
}