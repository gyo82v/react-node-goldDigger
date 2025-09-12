import { useState, useEffect } from "react"

export default function Transactions(){
    const [transactions, setTransactions] = useState([])
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
        <p key={t.id}>{t.date}: <strong>{t.name}</strong>purchased : {t.amount}; currnet value: {t.value}</p>
    ))

    return(
        <section>
            {transactionsArr}
        </section>
    )
}