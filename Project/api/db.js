import dotenv from "dotenv"
import {InfluxDB, Point} from "@influxdata/influxdb-client"
import fb from "node-firebird"

dotenv.config()

const token = process.env.INFLUXDB_TOKEN
let org = process.env.ORG
const url = 'http://172.17.0.5:8086'
export const bucket = `SakuMaja_Data`
export const db = new InfluxDB({url, token}).getQueryApi(org)

export const options = {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPAROL,
    database: 'C:/Archive/CARDS.FDB'
}