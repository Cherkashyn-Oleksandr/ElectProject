import {db} from "../db.js";

export const getAllData = async (req,res)=>{
    
    const q = `Select "Description", "Area", "Group" From "Counters"`
     
     const rows = db.query(q,'Electric')
    var array = []
     for await (const row of rows)

     array.push(row)
     res.status(200).json(array)
    
}

export const getFilterData = async (req,res) =>{
   console.log(req.body.filters.StartDate)
    const array = []
    
    if(req.body.filters.StartDate==null && req.body.filters.EndDate == null){
    for(let i=0;i<req.body.checked.length;i++){
    const q = `Select * From "Counters" WHERE "Description" = '${req.body.checked[i]}'`
    const rows = db.query(q,'Electric', "sql")
    for await (const row of rows)
    array.push(row)
    }
    res.status(200).json(array)
    }
    else
    {
        if(req.body.filters.StartDate!=null && req.body.filters.EndDate==null){
            for(let i=0;i<req.body.checked.length;i++){
                const q = `Select * From "Counters" WHERE "Description" = '${req.body.checked[i]}' AND "time" >= timestamp '${req.body.filters.StartDate}'`
                const rows = db.query(q,'Electric', "sql")
                for await (const row of rows)
                array.push(row)
                }
                res.status(200).json(array)
        }
        else{
            if(req.body.filters.StartDate==null && req.body.filters.EndDate!=null){
                for(let i=0;i<req.body.checked.length;i++){
                    const q = `Select * From "Counters" WHERE "Description" = '${req.body.checked[i]}' AND "time" <= timestamp '${req.body.filters.EndDate}'`
                    const rows = db.query(q,'Electric', "sql")
                    for await (const row of rows)
                    array.push(row)
                    }
                    res.status(200).json(array)
            }
            else{
                for(let i=0;i<req.body.checked.length;i++){
                    const q = `Select * From "Counters" WHERE "Description" = '${req.body.checked[i]}' AND "time" >= timestamp '${req.body.filters.StartDate}' AND "time" <= timestamp '${req.body.filters.EndDate}'`
                    const rows = db.query(q,'Electric', "sql")
                    for await (const row of rows)
                    array.push(row)
                    }
                    res.status(200).json(array)
            }
        }
    }
}
export const getData = async (req,res) =>{
    
    const q = `Select * From "Counters" WHERE "Description" = '${req}'`
    
    const rows = db.query(q, 'Electric', "sql")
    var array = []
    for await (const row of rows)
    array.push(row)
    res.status(200).json(array)
}