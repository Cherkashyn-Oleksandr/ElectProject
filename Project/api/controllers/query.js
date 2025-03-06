import {db, bucket} from "../db.js";
import { convertArray, getArray, transformArray, getHourlyArray, splitArray, checkId, AnalogData } from "./data.js";
// get data for treeview table
export const getAllData = async (req,res)=>{
  let {measurement} = req.query
  let newarray = [];
  let array = [];
  let fluxQuery = `
  from(bucket: "${bucket}")
    |> range(start: -1d)  
    |> filter(fn: (r) => r._measurement == "${measurement}")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
    |> keep(columns: ["_time", "Description", "Area", "Group"])
    |> group(columns: ["Group"])
    |> sort(columns: ["Group"], desc: false)`
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
  newarray = convertArray(array);
  res.status(200).json(newarray);
}
//get data with inserted filters
export const getFilterData = async (req,res) =>{
  let {measurement} = req.query
  let analogArray = []
  let newarray = []
  let finalarray = []
  if(req.body.checked[0] == undefined){
    return res.status(404).json("Select objects")
  }
  if(req.body.formattedFilters.StartDate >= req.body.formattedFilters.EndDate){
    return res.status(404).json("Wrong time period")
  }
    const tagArray = splitArray(req.body.checked)
    let array = []
    //check if client insert date filters

    
    if(req.body.formattedFilters.StartDate==null && req.body.formattedFilters.EndDate == null){
      for (let i = 0; i < tagArray.length; i++) {
    const fluxQuery = `from(bucket: "${bucket}")
    |> range(start: -1y)  
    |> filter(fn: (r) => r._measurement == "${measurement}" and r.Description == "${tagArray[i].Description}" and r.Group == "${tagArray[i].Group}")
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
         //console.log(array)
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
        if(req.body.formattedFilters.StartDate!=null && req.body.formattedFilters.EndDate==null){
          for (let i = 0; i < tagArray.length; i++) {
                const fluxQuery = `from(bucket: "${bucket}")
                |> range(start: ${req.body.formattedFilters.StartDate})
                |> filter(fn: (r) => r._measurement == "${measurement}" and r.Description == "${tagArray[i].Description}" and r.Group == "${tagArray[i].Group}")
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
        else{
           // if client inserted enddate
            if(req.body.formattedFilters.StartDate==null && req.body.formattedFilters.EndDate!=null){
              for (let i = 0; i < tagArray.length; i++) {
                    const fluxQuery = `from(bucket: "${bucket}")
                    |> range(start: 0, stop: ${req.body.formattedFilters.EndDate})
                    |> filter(fn: (r) => r._measurement == "${measurement}" and r.Description == "${tagArray[i].Description}" and r.Group == "${tagArray[i].Group}")
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
            else{
                // if client inserted both dates
                for (let i = 0; i < tagArray.length; i++) {
                    const fluxQuery = `from(bucket: "${bucket}")
                    |> range(start: ${req.body.formattedFilters.StartDate}, stop: ${req.body.formattedFilters.EndDate})
                    |> filter(fn: (r) => r._measurement == "${measurement}" and r.Description == "${tagArray[i].Description}" and r.Group == "${tagArray[i].Group}")
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
    let checkarray = array.some((element) => true)
    if(checkarray == false){
      return res.status(404).json("No data")
    }
    if(measurement == "Analog"){
      analogArray = AnalogData(array)
      
      return res.status(200).json(analogArray)
    }
    if(req.body.hourchecked == true){
   finalarray = getHourlyArray(array)

  }
  else{
   finalarray = getArray(array)

}
    newarray = transformArray(finalarray)
    res.status(200).json(newarray)
}
// elering electricity price
export const getTomorrowData = async (req,res) =>{
  const {Id} = req.query
  if(checkId(Id) == false){
    return res.status(400).json("WrongId");
  }
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(23, 59, 59, 999);
    fetch(`https://dashboard.elering.ee/api/nps/price?start=${tomorrow.toISOString()}&end=${end.toISOString()}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
    let prices = data.data.ee.map(item => item.price);
    let priceString = prices.join(", ");
    res.status(200).json(priceString)
  })
  .catch(error => {
    return res.status(400).json(`There was a problem ${error}`);
  });
}
export const getTodayData = async (req,res) =>{
  const {Id} = req.query
  if(checkId(Id) == false){
    return res.status(400).json("WrongId");
  }
  const today = new Date()
  const startDay = new Date(today)
  const endDay = new Date(today)
  startDay.setHours(0, 0, 0, 0);
  endDay.setHours(23, 59, 59, 999);
  fetch(`https://dashboard.elering.ee/api/nps/price?start=${startDay.toISOString()}&end=${endDay.toISOString()}`)
  .then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    return response.json();
  })
  .then(data => {
    let prices = data.data.ee.map(item => item.price);
    let priceString = prices.join(", ");
    res.status(200).json(priceString)
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
}