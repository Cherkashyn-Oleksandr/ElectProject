import {db} from "../db.js";
import { convertArray, getArray, transformArray } from "./data.js";

export const getAllData = async (req,res)=>{
    
    const q = `Select "Description", "Area", "Group" From "Counters"`
     
     const rows = db.query(q,'Electric')
    var array = []
     for await (const row of rows)

     array.push(row)
     let newarray = convertArray(array)
     res.status(200).json(newarray)
    
}

export const getFilterData = async (req,res) =>{
    const outputArray = req.body.checked.map(item => {
        const trimmedItem = item.trim(); // Trim any leading or trailing whitespace
        const commaIndex = trimmedItem.indexOf(','); // Find the index of the comma
        return trimmedItem.substring(0, commaIndex).trim(); // Extract substring before the comma and trim any leading or trailing whitespace
    });
    const array = []
    
    if(req.body.filters.StartDate==null && req.body.filters.EndDate == null){
    for(let i=0;i<outputArray.length;i++){
    const q = `Select * From "Counters" WHERE "Description" = '${outputArray[i]}' ORDER BY "Counters".time`
    const rows = db.query(q,'Electric', "sql")
    for await (const row of rows)
    array.push(row)
    }
    
    }
    else
    {
        if(req.body.filters.StartDate!=null && req.body.filters.EndDate==null){
            for(let i=0;i<outputArray.length;i++){
                const q = `Select * From "Counters" WHERE "Description" = '${outputArray[i]}' AND "time" >= timestamp '${req.body.filters.StartDate}' ORDER BY "Counters".time`
                const rows = db.query(q,'Electric', "sql")
                for await (const row of rows)
                array.push(row)
                }
                
        }
        else{
            if(req.body.filters.StartDate==null && req.body.filters.EndDate!=null){
                for(let i=0;i<outputArray.length;i++){
                    const q = `Select * From "Counters" WHERE "Description" = '${outputArray[i]}' AND "time" <= timestamp '${req.body.filters.EndDate}' ORDER BY "Counters".time`
                    const rows = db.query(q,'Electric', "sql")
                    for await (const row of rows)
                    array.push(row)
                    }
                    
            }
            else{
                for(let i=0;i<outputArray.length;i++){
                    const q = `Select * From "Counters" WHERE "Description" = '${outputArray[i]}' AND "time" >= timestamp '${req.body.filters.StartDate}' AND "time" <= timestamp '${req.body.filters.EndDate}' ORDER BY "Counters".time`
                    const rows = db.query(q,'Electric', "sql")
                    for await (const row of rows)
                    array.push(row)
                    }
                    
            }
        }
    }
    let finalarray = getArray(array)
    let newarray = transformArray(finalarray)
    res.status(200).json(newarray)
}
export const getData = async (req,res) =>{
    
    const date = new Date()
    console.log(date)
    const endDate = new Date
    endDate.setHours(date.getHours() - 1);
    console.log(endDate.toISOString())
    fetch(`https://dashboard.elering.ee/api/nps/price?start=${endDate.toISOString()}&end=${date.toISOString()}`)
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    return response.json();
  })
  .then(data => {
    res.status(200).json(data)
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}