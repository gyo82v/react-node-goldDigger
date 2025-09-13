import { useState, useEffect } from "react"

export default function Transactions(){
    const [transactions, setTransactions] = useState([])
    //tailwind
    const container = `p-4 flex flex-col gap-4 md:flex-row flex-wrap md:items-center md:justify-center
                       md:pt-14 md:gap-6`
     const span = `font-semibold text-stone-700 mr-2`
     const p = `text-stone-500`
     const div = `bg-gradient-to-br from-stone-200 to-stone-100 
                  shadow-lg shadow-stone-700/30 p-4 rounded-lg 
                  md:w-90 
                  transition-transform transition-colors transition-shadow duration-300 ease-in-out
                  hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:from-stone-300 hover:to-stone-200` 
    //
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/transactions")
                if(!res.ok) throw new Error("Unable to fetch the data")
                const data = await res.json()
                console.log(data)
                setTransactions(data)  
            } catch (err) {
              console.error("unable to fetch the data: ", err)
            }
        }
        fetchData()
    }, [])

    const transactionsArr = transactions.map(t => (
        <div className={div} key={t.id}>
            <p className={p}><span className={span}>Date: </span>{t.date}</p>
            <p className={p}><span className={span}>User: </span>{t.name}</p>
            <p className={p}><span className={span}>Amount: </span>{t.amount}</p>
            <p className={p}><span className={span}>Gold value: </span>£{t.value}</p>
            <p className={p}>
                <span className={span}>Total: </span><span className="text-amber-500 font-bold">£{t.total}</span>
            </p>
        </div>
    ))

    return(
        <section className={container}>
            {transactionsArr}
        </section>
    )
}