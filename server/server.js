import http from "node:http"
import path from "node:path"
import fs from "node:fs/promises"
import { getRandomValue } from "./utils.js"
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
  const amount = Number(body.amount)
  const value = Number(body.value)
  const total = Number(body.total)
  if(!name) return {ok : false, reason : "name is required"}
  if(!Number.isFinite(amount) || amount <= 0) return {ok : false, reason : "amount must be a positive number"}
  return {ok : true, value : {name, amount, value, total}}
}

await loadTransactions()

const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type")

    console.log("req: ", req.url, req.method)

    if(req.method === "OPTIONS"){
        res.writeHead(204)
        res.end()
        return
    }

    if(req.url === "/" && req.method === "GET"){
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        const payload = {value : getRandomValue()}
        res.end(JSON.stringify(payload))
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
                res.statusCode = 400
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({error : validation.reason}))
                return
            }
            const { name, amount, value, total } = validation.value

            // build transaction object
            const transaction = {
                id: nanoid(),                   
                name,
                date: new Date().toISOString(),
                amount,
                value,
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
                res.statusCode = 500
                res.setHeader("Content-Type", "application/json")
                res.end(JSON.stringify({error : "Failed to persisit transition"}))
                return
            }

            //success: return created resource
            res.statusCode = 201
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify(transaction))
            return
        } catch (err) {
            res.statusCode = 400
            res.setHeader("Content-Type", "application/json")
            res.end(JSON.stringify({ error: "Invalid JSON body" }))
            return
        }
    }
    
    if(req.url === "/transactions" && req.method === "GET"){
        res.statusCode = 200
        res.setHeader("Content-Type", "application/json")
        res.end(JSON.stringify(transactions))
        return
    }

    //fallback
    res.statusCode = 404
    res.setHeader("Content-Type", "text/plain")
    res.end("Not Founs")
})

server.listen(PORT, () => console.log(`connection established on port ${PORT}`))