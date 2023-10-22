import {db} from "../db.js";

export const getAllData = async (req,res)=>{
    
    const q = `Select "Area", "Group","Description" From "Counters"`
     
     const rows = db.query(q,'Electric')
    var array = []
     for await (const row of rows)

     array.push(row)
     res.status(200).json(array)
    


    
}
