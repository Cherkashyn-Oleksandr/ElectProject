import express from "express"
import routes from "./routes/data.js"
const app = express()
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use("/api/data", routes)
app.listen(8800,()=>{
    console.log("Connected")
})