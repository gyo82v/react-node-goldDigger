import http from "node:http"
import path from "node:path"
import fs from "node:fs/promises"
import { getRandomValue, serveResponse } from "./utils.js"
import {nanoid} from "nanoid"

const PORT  = 8000
const __dirname = import.meta.dirname
const DATA_PATH = path.join(__dirname, "data.json")
const TEMP_PATH = DATA_PATH + ".tmp"
let transactions = []

async function loadTransactions(){
    try {
        const raw = await fs.readFile(DATA_PATH, "utf8")
        transactions = JSON.parse(raw)
        console.log(`Loaded transactions form data.json`, transactions.length)
    } catch (err) {
        if(err.code === "ENOENT"){
            // No data.json yet -> use starter data (imported from data.js) and save it
            console.log("data.json not found; using starter data")
            transactions = []
            await saveTransactions()
        }else{
            console.error("error reading data.json", err)
            throw err
        }
    }
}

async function saveTransactions() {
    const payload = JSON.stringify(transactions, null, 2)
    await fs.writeFile(TEMP_PATH, payload, "utf8")
    await fs.rename(TEMP_PATH, DATA_PATH)
}

function validateTransactionBody(body){
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const gold = Number(body.gold)
  const silver = Number(body.silver)
  const platinum = Number(body.platinum)
  const goldValue = Number(body.goldValue)
  const silverValue = Number(body.silverValue)
  const platinumValue= Number(body.platinumValue)
  const total = Number(body.total)
  if(!name) return {ok : false, reason : "name is required"}
  return {ok : true, value : {name, gold, silver, platinum, goldValue, silverValue, platinumValue, total}}
}

await loadTransactions()

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    if(req.method === "OPTIONS"){
        res.writeHead(204)
        res.end()
        return
    }

    if(req.url === "/" && req.method === "GET"){
        const payload = {
            gold : getRandomValue(1.5, 3.0), 
            silver : getRandomValue(0.5, 2.0), 
            platinum : getRandomValue(2.5, 5.0)
        }
        serveResponse(res, 200, "application/json", payload)
        return
    }

    if (req.url === "/" && req.method === "POST") {
        let body = ""
        try {
            for await (const chunk of req) body += chunk
            const parsed = JSON.parse(body)

            //validate input
            const validation = validateTransactionBody(parsed)
            if(!validation.ok){
                serveResponse(res, 400, "application/json", {error : validation.reason})
                return
            }
            const { name, total, gold, silver, platinum, goldValue, silverValue, platinumValue } = validation.value

            // build transaction object
            const transaction = {
                id: nanoid(),                   
                name,
                date: new Date().toLocaleDateString("en-GB"),
                goldValue,
                silverValue,
                platinumValue,
                gold,
                silver,
                platinum,
                total
            }

            // append in memory
            transactions.push(transaction)

            // Try saving to disk atomically. If save fails, undo the in-memory push.
            try {
                await saveTransactions()
            } catch (err) {
                transactions.pop()
                console.log("failed to save transaction to disk", err)
                serveResponse(res, 500, "application/json", {error : "Failed to persisit transition"})
                return
            }

            //success: return created resource
            serveResponse(res, 201, "application/json", transaction)
            return
        } catch (err) {
            serveResponse(res, 400, "application/json", { error: "Invalid JSON body" })
            return
        }
    }
    
    if(req.url === "/transactions" && req.method === "GET"){
        serveResponse(res, 200, "application/json", transactions)
        return
    }

    //fallback
    serveResponse(res, 404, "text/plain", "Not founds")
})

server.listen(PORT, () => console.log(`connection established on port ${PORT}`))