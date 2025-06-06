import express from "express"
import { getAllData, getFilterData, getTodayData, getTomorrowData} from "../controllers/query.js"
import {login} from "../controllers/auth.js"
import { getTreeView, getValues } from "../controllers/sqlQuery.js"


const router = express.Router()

router.get("/", getAllData)
router.post("/all", getFilterData)
router.get("/table/today", getTodayData)
router.get("/table/tomorrow", getTomorrowData)
router.post("/login",login)
router.get("/treeView", getTreeView)
router.post("/allValues", getValues)

export default router