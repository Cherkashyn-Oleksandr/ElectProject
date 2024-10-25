import React, { useEffect, useState,} from "react"
import {useNavigate} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"
import Datetime from "react-datetime"
import "moment/locale/et"
import "react-datetime/css/react-datetime.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../Home.css"


const Home = () => {
    const fetchData = async ()=>{
        try{
            const res = await axios.get("http://172.17.0.3:8800/api/data");
            setTags(res.data);
        }catch(err){
            console.log(err);
        }
    };
    //accepting data from influx, needs to change array format for treeview
    const [tags, setTags] = useState([]);
    useEffect(()=>{
        fetchData();
    },[]);
    
    const currentDate = new Date()

    const previousDay = new Date(currentDate)

    previousDay.setDate(previousDay.getDate() - 1)

    const [err,setError] = useState(null)

    const [checked, setChecked] = useState([])

    const [hourchecked, setHourchecked] = useState(false)

    const [loendurchecked, setLoendurchecked] = useState(false)

    const [filters, setFilters] = useState({
        StartDate:previousDay,
        EndDate:currentDate,
    })
    const [objectFilters, setObjects] = useState({
        Area:"",
        Group:"",
        Description:"",
    })
    const handleHourCheckbox = () => {
        setHourchecked(!hourchecked)
    }

    const handleLoendurCheckbox = () => {
        setLoendurchecked(!loendurchecked)
    }

    const handleChange = e =>{
        setObjects(prev=>({...prev, [e.target.name]: e.target.value}))
    }

    const ChangeStartDate = e =>{
        setFilters(prev=>({...prev, StartDate: e}))
    }
    const ChangeEndDate = e =>{
        setFilters(prev=>({...prev, EndDate: e}))
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
        const formattedFilters = {
            ...filters,
            StartDate: filters.StartDate.toISOString(),
            EndDate: filters.EndDate.toISOString(),
        };
        try{
         const res = await axios.post("http://172.17.0.3:8800/api/data/all", {checked, formattedFilters, hourchecked, loendurchecked})
         sessionStorage.setItem('Array',JSON.stringify(res.data))
         sessionStorage.setItem('Dates',JSON.stringify(formattedFilters))
         sessionStorage.setItem('LoendurСhecked',JSON.stringify(loendurchecked))
        navigate("/data")
    }
        catch(err){
            setError(err.response.data)
    }
    }
    
    const handleArray = async e =>{
        e.preventDefault()
        try{
            const { Area, Group, Description } = objectFilters; 

const Array = tags.filter(item => {
   
    const hasArea = Area !== "" && item.value.toLowerCase().includes(Area.toLowerCase());
    let hasDescription = false;
    if (Description !== "") {
        item.children.forEach(child => {
            child.children = child.children.filter(grandchild =>
                grandchild.value.toLowerCase().includes(Description.toLowerCase())
            );
        });
        hasDescription = item.children.some(child => child.children.length > 0);
        

    }
    let hasGroup = false;
    if (Group !== "") {
        item.children = item.children.filter(child => child.value.toLowerCase().includes(Group.toLowerCase()));
        hasGroup = item.children.length > 0;
    }


    
    return hasArea || hasGroup || hasDescription;

});

    
    setTags(Array)
        }
        catch(err){
            setError(err.response.data)
        }
    }
    return (
    <div className="main-container">
            <div className="left-container">
                <div className="label">Objektid</div>
                <div className="object-filter">
                <div className="data-filters">Area
                <input required type="text" placeholder='Area' name='Area' onChange={handleChange}></input>
                </div>
                <div className="data-filters">Group
                <input required type="text" placeholder='Group' name='Group' onChange={handleChange}></input>
                </div>
                <div className="data-filters">Description
                <input required type="text" placeholder='Description' name='Description' onChange={handleChange}></input>
                </div>
                </div>
                <div className="filter-buttons"><button onClick={handleArray}>Otsi</button>
                <button style={{marginLeft: '10px'}} onClick={fetchData}>Refresh Data</button>
                </div>
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
                <Datetime value={filters.StartDate} locale='et' className='StartDate' onChange={ChangeStartDate}/>
                </div>
                <div className="label">Kuni
                <Datetime value={filters.EndDate} locale='et' className='EndDate' onChange={ChangeEndDate}/>
                </div>
            </div>
            <div className="checkbox">
                <div className="checkbox-item">
                <Checkbox
                label="Päeva Raport"
                value={hourchecked}
                onChange={handleHourCheckbox}
                />
                </div>
                <div className="checkbox-item">
            <Checkbox
                label="Näita absoluutne väärtus"
                value={loendurchecked}
                onChange={handleLoendurCheckbox}
                />
                </div>
            </div>
            <div className="raport-button">
            <button onClick={handleSubmit} >Raport</button>
                
                
        </div>
        {err &&<p>{err}</p>} 
        </div>               
    </div> 
    );

}
const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };
export default Home