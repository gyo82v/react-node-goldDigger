import { useState, useEffect } from "react"

export default function Home(){
    const [formdata, setformdata] = useState({name : "", amount : ""})
    const [currentValue, setCurrentValue] = useState(0)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)


    //tailwind
    const container = `p-4 flex flex-col items-center mt-10`
    const form = `bg-gradient-to-b from-stone-500 to-stone-400 rounded-lg
                  p-4 shadow-lg shadow-stone-700/30 gap-6
                  flex flex-col w-11/12 md:w-6/12 xl:w-4/12`
    const fieldset = `border border-amber-300 rounded-lg flex items-center`
    const legend = `text-amber-300 font-semibold mx-4`
    const p = `mb-2 ml-5 text-amber-300 font-bold text-lg`
    const input = `bg-stone-200 p-2 rounded-lg text-stone-700 font-semibold border-2 border-stone-300
                   focus:outline-none focus:ring-2 focus:ring-amber-300 no-spinner
                   focus:bg-stone-300 focus:scale-105 hover:border-stone-500
                   transition-transform transition-colors transition-shadow duration-300 ease-in-out`
    const btn = `bg-gradient-to-br from-amber-500 via-stone-400 to-amber-300 
                 py-2 px-4 text-lg font-bold text-stone-600 shadow-lg shadow-stone-700/30 rounded-lg
                 transition-transform transition-colors transition-shadow duration-300 ease-in-out
                 hover:scale-110 active:scale-95 hover:shadow-xl hover:from-amber-300 hover:to-amber-500
                 hover:text-stone-800`
    //

    useEffect(() => {
        let mounted = true

        const fetchCurrent = async () => {
            try {
                const res = await fetch("http://localhost:8000/")
                if(!res.ok) throw new Error("failed to fecth current data")
                const data = await res.json()
                if(mounted) setCurrentValue(data.value)
            } catch (err) {
               console.error("counldnt fetch the data: ", err)                
            }
        }
        fetchCurrent()
        const id = setInterval(fetchCurrent, 5000)
        return  () => {mounted = false, clearInterval(id)} 
    }, [])


    const handleChange = e => {
        const {name, value} = e.target 
        setformdata(f => ({...f, [name] : value}))
    }
    const handleSubmit = async e => {
        e.preventDefault()
        setError(null)

        const amt = Number(formdata.amount)
        if(!formdata.name.trim()) {setError("Name required"); return}
        if(!Number.isFinite(amt) && amt < 1) {setError("must be a positive numbe"); return}

        const snapshotCurrent = currentValue
        const total = amt * snapshotCurrent

        const payload = {
            name : formdata.name.trim(),
            amount : amt,
            value : snapshotCurrent,
            total : total
        }

        try {
            setIsSubmitting(true)
            const res = await fetch("http://localhost:8000/", {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify(payload)
            })
            if(!res.ok){throw new Error("response error")}
            setformdata({name : "", amount : ""})
        } catch (err) {
            console.error("couldnt update the server: ", err)   
            setError("submission failed")         
        }finally{
            setIsSubmitting(false)
        }
    }

    return(
        <section className={container}>
            <form onSubmit={handleSubmit} className={form}>
                <fieldset className={fieldset}>
                    <legend className={legend}>Live price</legend>
                    <p className={p}>£{currentValue}</p>
                </fieldset>
                <input 
                  type="text"
                  className={input}
                  placeholder="Enter your name..."
                  arai-label="Enter your name"
                  value={formdata.name}
                  onChange={handleChange}
                  name="name"
                  required
                />
                <input
                  type="number"
                  className={input}
                  placeholder="Enter the amount of gold..."
                  aria-label="Enter the amount of gold"
                  value={formdata.amount}
                  onChange={handleChange}
                  name="amount"
                  required
                />
                <button className={btn} type="submit">Buy now</button>
            </form>
        </section>
    )
}