import { useState, useEffect } from "react"
import FormEl from "../components/FormEl"

export default function Home(){
    const [formdata, setformdata] = useState({name : "", amount : ""})
    const [currentValue, setCurrentValue] = useState({gold: 0, silver : 0, platinum : 0})
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)


    //tailwind
    const container = `p-4 flex flex-col items-center mt-10`
    //

    useEffect(() => {
        let mounted = true

        const fetchCurrent = async () => {
            try {
                const res = await fetch("http://localhost:8000/")
                if(!res.ok) throw new Error("failed to fecth current data")
                const data = await res.json()
                if(mounted) setCurrentValue({gold : data.gold, silver : data.silver, platinum : data.platinum})
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

        const snapshotCurrent = currentValue.gold
        const total = amt * snapshotCurrent

        const payload = {
            name : formdata.name.trim(),
            amount : amt,
            value : snapshotCurrent,
            total : total.toFixed(3)
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
            <FormEl 
              currentValue={currentValue} 
              handleChange={handleChange} 
              handleSubmit={handleSubmit} 
              formdata={formdata} 
            />
        </section>
    )
}