import {db, bucket} from "../db.js";
import { convertArray, getArray, transformArray, getHourlyArray, transformHourlyArray } from "./data.js";
// get data for treeview table
export const getAllData = async (req,res)=>{
  let newarray = [];
  let array = [];
  let fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -1y)  
    |> filter(fn: (r) => r._measurement == "Counters")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> keep(columns: ["_time", "Description", "Area", "Group"])
  `
  try {
   
    await new Promise((resolve,reject)=>{
    const observer = {
      
      next: (row, tableMeta) => {
        const o = tableMeta.toObject(row);
        array.push(o);
      },
      error: (error) => {
        console.error('\nError', error);
        res.status(500).json({ error: error.message });
        reject();
      },
      complete: () => {
        console.log('\nSuccess');
        resolve();

      },
    };
    db.queryRows(fluxQuery, observer);
  })

  } catch (error) {
    console.error('Error querying data:', error);
    res.status(500).json({ error: error.message });
  }   
  newarray = convertArray(array);
  res.status(200).json(newarray);
}
//get data with inserted filters
export const getFilterData = async (req,res) =>{
  let newarray = []
    const outputArray = req.body.checked.map(item => {
        const trimmedItem = item.trim(); // Trim any leading or trailing whitespace
        const commaIndex = trimmedItem.indexOf(','); // Find the index of the comma
        return trimmedItem.substring(0, commaIndex).trim(); // Extract substring before the comma and trim any leading or trailing whitespace
    });
    let array = []
    //check if client insert date filters

    
    if(req.body.filters.StartDate==null && req.body.filters.EndDate == null){
    for(let i=0;i<outputArray.length;i++){
      console.log(outputArray[i])
    const fluxQuery = `from(bucket: "${bucket}")
    |> range(start: -1y)  
    |> filter(fn: (r) => r._measurement == "Counters" and r.Description == "${outputArray[i]}")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`
    try {
   
      await new Promise((resolve,reject)=>{
      const observer = {
        
        next: (row, tableMeta) => {
          const o = tableMeta.toObject(row);

          array.push(o);

        },
        error: (error) => {
          console.error('\nError', error);
          res.status(500).json({ error: error.message });
          reject();
        },
        complete: () => {
         console.log('\nSuccess');
         console.log(array)
          resolve();
  
        },
      };
      db.queryRows(fluxQuery, observer);
    })
  
    } catch (error) {
      console.error('Error querying data:', error);
      res.status(500).json({ error: error.message });
    }   
    }}
    else
    {
        // if client inserted startdate
        if(req.body.filters.StartDate!=null && req.body.filters.EndDate==null){
            for(let i=0;i<outputArray.length;i++){
                const fluxQuery = `from(bucket: "${bucket}")
                |> range(start: ${req.body.filters.StartDate})
                |> filter(fn: (r) => r._measurement == "Counters" and r.Description == "${outputArray[i]}")
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`
                try {
   
                  await new Promise((resolve,reject)=>{
                  const observer = {
                    
                    next: (row, tableMeta) => {
                      const o = tableMeta.toObject(row);
                      
                      array.push(o);
                    },
                    error: (error) => {
                      console.error('\nError', error);
                      res.status(500).json({ error: error.message });
                      reject();
                    },
                    complete: () => {
                      console.log('\nSuccess');
                      resolve();
              
                    },
                  };
                  db.queryRows(fluxQuery, observer);
                })
              
                } catch (error) {
                  console.error('Error querying data:', error);
                  res.status(500).json({ error: error.message });
                }   
                }
                
        }
        else{
           // if client inserted enddate
            if(req.body.filters.StartDate==null && req.body.filters.EndDate!=null){
                for(let i=0;i<outputArray.length;i++){
                    const fluxQuery = `from(bucket: "${bucket}")
                    |> range(start: 0, stop: ${req.body.filters.EndDate})
                    |> filter(fn: (r) => r._measurement == "Counters" and r.Description == "${outputArray[i]}")
                    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`
                    try {
   
                      await new Promise((resolve,reject)=>{
                      const observer = {
                        
                        next: (row, tableMeta) => {
                          const o = tableMeta.toObject(row);
                          
                          array.push(o);
                        },
                        error: (error) => {
                          console.error('\nError', error);
                          res.status(500).json({ error: error.message });
                          reject();
                        },
                        complete: () => {
                          console.log('\nSuccess');
                          resolve();
                  
                        },
                      };
                      db.queryRows(fluxQuery, observer);
                    })
                  
                    } catch (error) {
                      console.error('Error querying data:', error);
                      res.status(500).json({ error: error.message });
                    }   
                    }
                    
            }
            else{
                // if client inserted both dates
                for(let i=0;i<outputArray.length;i++){
                    const fluxQuery = `from(bucket: "${bucket}")
                    |> range(start: ${req.body.filters.StartDate}, stop: ${req.body.filters.EndDate})
                    |> filter(fn: (r) => r._measurement == "Counters" and r.Description == "${outputArray[i]}")
                    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`
                    try {
   
                      await new Promise((resolve,reject)=>{
                      const observer = {
                        
                        next: (row, tableMeta) => {
                          const o = tableMeta.toObject(row);
                          
                          array.push(o);
                        },
                        error: (error) => {
                          console.error('\nError', error);
                          res.status(500).json({ error: error.message });
                          reject();
                        },
                        complete: () => {
                          //console.log('\nSuccess');
                          resolve();
                  
                        },
                      };
                      db.queryRows(fluxQuery, observer);
                    })
                  
                    } catch (error) {
                      console.error('Error querying data:', error);
                      res.status(500).json({ error: error.message });
                    }   
                    }
                    
            }
        }
    }
    
    if(req.body.boxchecked == true){
    let finalarray = getHourlyArray(array)
    newarray = transformHourlyArray(finalarray)
  }
  else{
    let finalarray = getArray(array)
    newarray = transformArray(finalarray)
}
    res.status(200).json(newarray)
}
// elering electricity price
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