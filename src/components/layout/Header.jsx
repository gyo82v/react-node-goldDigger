import { NavLink } from "react-router-dom"
import logoImg from "../../images/gold.png"

export default function Header(){
    const link = `text-amber-400 font-semibold xl:text-lg 
                  transition-transform transition-colors duration-300 ease-in-out
                  hover:scale-110 active:scale-95 hover:text-amber-500`
    return(
        <header className="flex items-center p-4 bg-gradient-to-br from-stone-700 to-stone-600">
            <section className="flex items-center gap-2 mr-auto md:ml-6">
                <img src={logoImg} alt="logo" className="h-10 w-10 md:h-16 md:w-16" />
                <h1 className="text-xl md:text-2xl font-bold text-amber-400">GoldDigger</h1>
            </section>
            <nav className="flex gap-4 md:mr-6 xl:mr-20 md:gap-6 xl:gap-10">
                <NavLink to="/" className={({isActive}) => isActive ? `${link} underline` : link}>
                    Home
                </NavLink>
                <NavLink to="transactions" className={({isActive}) => isActive ? `${link} underline` : link}>
                    Transactions
                </NavLink>
            </nav>
        </header>
    )

}