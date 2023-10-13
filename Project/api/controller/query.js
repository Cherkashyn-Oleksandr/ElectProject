import db from "../db.js"

export const getAllData = (req,res)=>{
    const q = `Select "Area", "Group","Description" From "Counters"`

    db.query(q,(err,data)=>{
        if(err) return res.status(500).send(err);

        return res.status(200).json(data);
        
    })
}