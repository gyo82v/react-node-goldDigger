import { useState, useEffect } from "react"

export default function Transactions(){
    const [transactions, setTransactions] = useState([])
    //tailwind
    const container = `p-4  flex flex-col gap-4 md:flex-row flex-wrap md:items-center md:justify-center
                       md:pt-14 md:gap-6`
     const span = `font-semibold text-stone-700 mr-2`
     const p = `text-stone-500 flex-1`
     const card = `bg-gradient-to-br from-stone-200 to-stone-100 flex flex-col gap-3
                  shadow-lg shadow-stone-700/30 p-4 rounded-lg md:w-90 w-full
                  transition-transform transition-colors transition-shadow duration-300 ease-in-out
                  hover:cursor-pointer hover:scale-105 hover:shadow-xl hover:from-stone-300 hover:to-stone-200` 
    //
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:8000/transactions")
                if(!res.ok) throw new Error("Unable to fetch the data")
                const data = await res.json()
                setTransactions(data)  
            } catch (err) {
              console.error("there was a problem fetching the data: ", err)
            }
        }
        fetchData()
    }, [])

    const transactionsArr = transactions.map(t => (
        <div className={card} key={t.id}>
            <div className="flex gap-4">
              <p className={p}><span className={span}>Date: </span>{t.date}</p>
              <p className={p}><span className={span}>User: </span>{t.name}</p>
            </div> 
            <section className="flex flex-col gap-1">
              <div className="flex gap-1">
                  <p className="font-bold text-amber-400 flex-1 ">Gold: </p>
                  <p className={p}><span className={span}>Value: </span>£{t.goldValue}</p>
                  <p className={p}><span className={span}>Aquired: </span>{t.gold}</p>
              </div>
              <div className="flex gap-1">
                  <p className="font-bold text-green-400 flex-1">Silver: </p>
                  <p className={p}><span className={span}>Value: </span>£{t.silverValue}</p>
                  <p className={p}><span className={span}>Aquired: </span>{t.silver}</p>
              </div>
              <div className="flex gap-1">
                  <p className="font-bold text-purple-400 flex-1">Platinum: </p>
                  <p className={p}><span className={span}>Value: </span>£{t.platinumValue}</p>
                  <p className={p}><span className={span}>Aquired: </span>{t.platinum}</p>
              </div>
            </section>
            <p className={p}>
                <span className={span}>Total: </span>
                <span className="text-amber-700 font-bold">£{t.total}</span>
            </p>
        </div>
    ))

    return(
        <section className={container}>
            {transactionsArr}
        </section>
    )
}