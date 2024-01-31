import express from "express"
import { getAllData, getFilterData, getData} from "../controller/query.js"


const router = express.Router()

router.get("/", getAllData)
router.post("/all", getFilterData)
router.get("/table", getData)



export default router