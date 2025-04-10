import express from "express"
import fs  from "fs"
import https from "https"
import routes from "./routes/data.js"
const app = express()
const options = {
  rejectUnauthorized: false,
  requestCert: false,//add when working with https sites
  agent: false,//add when working with https sites
  key: fs.readFileSync('C:/Users/Oleksandr/ElectProject/Project/api/certs/private.key'),
  cert: fs.readFileSync('C:/Users/Oleksandr/ElectProject/Project/api/certs/certificate.crt'), 
};
app.use(express.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use("/api/data", routes)
https.createServer(options, app).listen(8800, () => {
  console.log("Connected");
});