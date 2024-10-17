import React, {useState} from "react"
import axios from "axios"
import "../Home.css"

const Table = () =>{
    const [err,setError] = useState(null)
    const [Data, setData] = useState([])
    const [identifier, setID] = useState([])
    const handleTomorrowSubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.get(`http://172.17.0.3:8800/api/data/table/tomorrow?Id=${identifier.Id}`)
        setData(res.data)
    }
        catch(err){
            setError(err.response.data)
    }
    }
    const handleTodaySubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.get(`http://172.17.0.3:8800/api/data/table/today?Id=${identifier.Id}`)
        setData(res.data)
    }
        catch(err){
            setError(err.response.data)
    }
    }
    const handleChange = e =>{
        setID(prev=>({...prev, [e.target.name]: e.target.value}))
    }
    return (
        <div className="main-container">
            <div className="right-container">
                <label>identifier</label>
            <div className="object-filter">
            <div className="data-filters">
                <input required type="number"  placeholder='ID' name='Id' onChange={handleChange} ></input>
                </div>
                </div>
                <div className="filter-buttons">
            <button onClick={handleTodaySubmit}>Get Today</button>
            <button style={{marginLeft: '10px'}} onClick={handleTomorrowSubmit}>Get Tomorrow</button>
            </div>
            <label></label>
            {err &&<p>{err}</p>}
            <label>{Data}</label>
        </div>
        </div>
    );
}
export default Table