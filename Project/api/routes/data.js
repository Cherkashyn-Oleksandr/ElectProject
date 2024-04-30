import express from "express"
import { getAllData, getFilterData, getData} from "../controllers/query.js"
import {login} from "../controllers/auth.js"


const router = express.Router()

router.get("/", getAllData)
router.post("/all", getFilterData)
router.get("/table", getData)
router.post("/login",login)




export default router