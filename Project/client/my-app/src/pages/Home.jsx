import React, { useEffect, useState } from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"
import Datetime from "react-datetime"
import "moment/locale/et"
import "react-datetime/css/react-datetime.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../Home.css"


const Home = () => {
    //accepting data from influx, needs to change array format for treeview
    const [tags, setTags] = useState([]);
    useEffect(()=>{
        const fetchData = async ()=>{
            try{
                const res = await axios.get("http://192.168.20.17:8800/api/data");
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
   
     // get filters data
    const handleSubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.post("http://192.168.20.17:8800/api/data/all", {checked, filters})
         sessionStorage.setItem('Array',JSON.stringify(res.data))
         sessionStorage.setItem('Dates',JSON.stringify(filters))
        navigate("/data")
    }
        catch(err){
            setError(err.response.data)
    }
    }

   
//treeview
    return (
    <div className="main-container">
            <div className="left-container">
                <div className="label">Objektid</div>
                <CheckboxTree className="checkbox"
                checked={checked}
                expanded={expanded}
                nodes={tags}
                onCheck={onCheck}
                onExpand={onExpand}
                />  
            </div>
        <div className="right-container">
            <div className="datetime">
                <div className="label">Alates
                <Datetime locale='et' className='StartDate' onChange={ChangeStartDate}/>
                </div>
                <div className="label">Kuni
                <Datetime locale='et' className='EndDate' onChange={ChangeEndDate}/>
                </div>
            </div>
            <div className="raport-button">
            <button onClick={handleSubmit} >Raport</button>
                {err &&<p>{err}</p>} 
        </div>
        </div>               
    </div> 
    );
}

export default Home
