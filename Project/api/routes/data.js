import express from "express"
import { getAllData } from "../controller/query.js"


const router = express.Router()

router.get("/", getAllData)




export default router