export default function FormEl({currentValue, handleChange, handleSubmit, formdata}){
    const form = `bg-gradient-to-b from-stone-500 to-stone-400 rounded-lg
                  p-4 shadow-lg shadow-stone-700/30 gap-6
                  flex flex-col w-11/12 md:w-6/12 xl:w-4/12`
    const fieldset = `border border-amber-300 rounded-lg flex items-center`
    const legend = `text-amber-300 font-semibold mx-4`
    const p = `text-amber-300 font-bold text-lg `
    const input = `bg-stone-200 p-2 rounded-lg text-stone-700 font-semibold border-2 border-stone-300
                   focus:outline-none focus:ring-2 focus:ring-amber-300 no-spinner
                   focus:bg-stone-300 focus:scale-105 hover:border-stone-500
                   transition-transform transition-colors transition-shadow duration-300 ease-in-out`
    const btn = `bg-gradient-to-br from-amber-500 via-stone-400 to-amber-300 
                 py-2 px-4 text-lg font-bold text-stone-600 shadow-lg shadow-stone-700/30 rounded-lg
                 transition-transform transition-colors transition-shadow duration-300 ease-in-out
                 hover:scale-110 active:scale-95 hover:shadow-xl hover:from-amber-300 hover:to-amber-500
                 hover:text-stone-800`
    const div = `flex items-center justify-between w-full p-2 mb-2`
    const input1 = `bg-stone-200 p-2 rounded-lg text-stone-700 font-semibold border-2 border-stone-300
                   focus:outline-none focus:ring-2 focus:ring-amber-300 no-spinner w-24
                   focus:bg-stone-300 focus:scale-105 hover:border-stone-500
                   transition-transform transition-colors transition-shadow duration-300 ease-in-out`
    return(
        <form className={form} onSubmit={handleSubmit}>
            <fieldset className={fieldset}>
                <legend className={legend}>Live price gold</legend>
                <div className={div}>
                    <p className={p}>£{currentValue.gold}</p>
                    <input
                      type="number"
                      className={input1}
                      placeholder="Quantity..."
                      aria-label="Enter the amount of gold"
                      value={formdata.gold}
                      onChange={handleChange}
                      name="gold"
                      required
                    />
                </div>
            </fieldset>
            <fieldset className={fieldset}>
                <legend className={legend}>Live price silver</legend>
                <div className={div}>
                   <p className={p}>£{currentValue.silver}</p>
                   <input
                     type="number"
                     className={input1}
                     placeholder="Quantity..."
                     aria-label="Enter the amount of gold"
                     value={formdata.silver}
                     onChange={handleChange}
                     name="silver"
                     required
                   />
                </div>
            </fieldset>
            <fieldset className={fieldset}>
                <legend className={legend}>Live price platinum</legend>
                <div className={div}>
                    <p className={p}>£{currentValue.platinum}</p>
                    <input
                      type="number"
                      className={input1}
                      placeholder="Quantity..."
                      aria-label="Enter the amount of gold"
                      value={formdata.platinum}
                      onChange={handleChange}
                      name="platinum"
                      required
                    />
                </div>
            </fieldset>
            <input 
              type="text"
              className={input}
              placeholder="Enter your name..."
              aria-label="Enter your name"
              value={formdata.name}
              onChange={handleChange}
              name="name"
              required
            />
            <button className={btn} type="submit">Buy now</button>
        </form>
    )
}