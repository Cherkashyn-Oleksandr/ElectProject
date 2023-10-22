import express from "express"
import routes from "./routes/data.js"
const app = express()
app.use(express.json())


app.use("/api/data", routes)
app.listen(8800,()=>{
    console.log("Connected")
})