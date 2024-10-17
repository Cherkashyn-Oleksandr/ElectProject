import dotenv from "dotenv"
import {InfluxDB, Point} from "@influxdata/influxdb-client"

dotenv.config()

const token = process.env.INFLUXDB_TOKEN
let org = process.env.ORG
const url = 'http://172.17.0.3:8086'
export const bucket = `ObjectData`
export const db = new InfluxDB({url, token}).getQueryApi(org)