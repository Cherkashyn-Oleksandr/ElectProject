import dotenv from 'dotenv'
import {InfluxDBClient, Point} from '@influxdata/influxdb3-client'

dotenv.config()

const token = process.env.INFLUXDB_TOKEN

export const db = new InfluxDBClient({host: 'https://eu-central-1-1.aws.cloud2.influxdata.com', token: token})