import React, { useEffect, useState } from "react"
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"
import Datetime from "react-datetime"
import "moment/locale/et"
import "react-datetime/css/react-datetime.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";


const Home = () => {
    //accepting data from influx, needs to change array format for treeview
    const [tags, setTags] = useState([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get("/data");
                setTags(res.data);
            }catch(err){
                console.log(err);
            }
        };
        fetchData();
        
        
    },);
    function convertArray(originalArray) {
        let result = [];
    
        // Create an object to hold temporary mappings
        let tempMap = {};
    
        // Iterate over the original array
        originalArray.forEach(item => {
            // Extract relevant properties
            let { Description, Area, Group } = item;
    
            // Check if Area already exists in tempMap
            if (!tempMap[Area]) {
                // If not, create a new object
                tempMap[Area] = {
                    value: Area,
                    label: Area,
                    children: []
                };
                result.push(tempMap[Area]);
            }
    
            // Check if Group already exists in tempMap under the current Area
            let groupIndex = tempMap[Area].children.findIndex(child => child.value === Group);
            if (groupIndex === -1) {
                // If not, create a new object
                tempMap[Area].children.push({
                    value: `${Group} ${Area}`,
                    label: Group,
                    children: []
                });
                groupIndex = tempMap[Area].children.length - 1;
            }
    
            // Add the Description as a child under the current Group
            tempMap[Area].children[groupIndex].children.push({
                value: Description,
                label: Description
            });
        });
    
        return result;
    }
    
    const [err,setError] = useState(null)

    const [checked, setChecked] = useState([])

    const [filters, setFilters] = useState({
        StartDate:null,
        EndDate:null,

    })
    // Convert the array
    let TagArray = convertArray(tags); 

    const ChangeStartDate = e =>{
        setFilters(prev=>({...prev, StartDate: e.toISOString()}))
    }
    const ChangeEndDate = e =>{
        setFilters(prev=>({...prev, EndDate: e.toISOString()}))
    }
    
    const navigate = useNavigate()

    const [expanded, setExpanded] = useState([]);

    const [AllData, SetData] = useState ([]);

    const onCheck = (value) => {
        setChecked(value);
        
    };

    const onExpand = (value) => {
        setExpanded(value);
    };
   
    
    
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html,"text/html")
        return doc.body.textContent
      }
     // get filters data
    const handleSubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.post("/data/all", {checked, filters})
         console.log(res)
        SetData(res.data)
    }
        catch(err){
            setError(err.response.data)
    }
    }

   
//treeview
    return (
    <div>
        <div>
            <div>
                <CheckboxTree 
                checked={checked}
                expanded={expanded}
                nodes={TagArray}
                onCheck={onCheck}
                onExpand={onExpand}
                />  
            </div>
        <div>
            <div>
                <Datetime locale='et' className='StartDate' onChange={ChangeStartDate}/>
            </div>
            <div>
                <Datetime locale='et' className='EndDate' onChange={ChangeEndDate}/>
            </div>
        </div>
    </div>
        <div>
            <button onClick={handleSubmit}>GetData</button>
                {err &&<p>{err}</p>}
        </div>               
        <div>
           <div className="posts">
                {AllData.map((data)=>(
                <div className="post" key={data.Area}>   
                    <div className="content">
                        <h1>{data.Group}</h1>
                        <h1>{data.Area}</h1>
                        <p>{getText(data.Description)}</p>
                        <p>{getText(data.Realvalue)}</p>
                        <p>{getText(data.Quality)}</p>
                        <p>{getText(new Date(data.time))}</p>   
                    </div>
                </div>
                ))}
            </div> 
        </div>
    </div> 
    );
}

export default Home