import React, { useEffect, useState } from "react"
import {Link, json, useNavigate} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"
import Datetime from "react-datetime"
import "moment/locale/et"
import "react-datetime/css/react-datetime.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Data from "./Data"


const Home = () => {
    //accepting data from influx, needs to change array format for treeview
    const [tags, setTags] = useState([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get("http://localhost:8800/api/data");
                setTags(res.data);
            }catch(err){
                console.log(err);
            }
        };
        fetchData();
        
        
    },[]);
    
    const [err,setError] = useState(null)

    const [checked, setChecked] = useState([])

    const [filters, setFilters] = useState({
        StartDate:null,
        EndDate:null,

    })
    // Convert the array
     

    const ChangeStartDate = e =>{
        setFilters(prev=>({...prev, StartDate: e.toISOString()}))
    }
    const ChangeEndDate = e =>{
        setFilters(prev=>({...prev, EndDate: e.toISOString()}))
    }
    
    const navigate = useNavigate()

    const [expanded, setExpanded] = useState([]);

    
    
    
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
         const res = await axios.post("http://localhost:8800/api/data/all", {checked, filters})
         sessionStorage.setItem('Array',JSON.stringify(res.data))
        navigate("/data")
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
                nodes={tags}
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
            <button onClick={handleSubmit} >GetData</button>
                {err &&<p>{err}</p>}
                
        </div>               
    </div> 
    );
}

export default Home
