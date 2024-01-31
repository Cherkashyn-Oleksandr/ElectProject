import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"


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
    const [err,setError] = useState(null)

    const [checked, setChecked] = useState([])

    
   
    
    const navigate = useNavigate()

    const [expanded, setExpanded] = useState([]);

    const [AllData, SetData] = useState ([]);

    const onCheck = (value) => {
        setChecked(value);
        
    };

    const onExpand = (value) => {
        setExpanded(value);
    };
    // example of array nees to connect database with treeview
    const tests =
    [
    {
        value: "Puurkaev PK2",
        label: "Puurkaev PK2",
        children:[
        {
            value: "Elektrienergia PK2", 
            label: "Elektrienergia",
            children:[
                {
                    value: "Puurkaev PK2 elektrienergia [kWh]",
                    label: "Puurkaev PK2 elektrienergia [kWh]"
                }
            ]},
            {
            value: "Kulumootjad PK2", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK2 kulumootja [m3]",
                    label: "Puurkaev PK2 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK3",
        label: "Puurkaev PK3",
        children:[
        {
            value: "Elektrienergia PK3", 
            label: "Elektrienergia",
            children:[
                {
                    value: "Puurkaev PK3 elektrienergia [kWh]",
                    label: "Puurkaev PK3 elektrienergia [kWh]"
                }
            ]},
            {
            value: "Kulumootjad PK3", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK3 kulumootja [m3]",
                    label: "Puurkaev PK3 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK1",
        label: "Puurkaev PK1",
        children:[
        {
            value: "Kulumootjad PK1", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK1 kulumootja [m3]",
                    label: "Puurkaev PK1 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK4",
        label: "Puurkaev PK4",
        children:[
        {
            value: "Kulumootjad PK4", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK4 kulumootja [m3]",
                    label: "Puurkaev PK4 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK5",
        label: "Puurkaev PK5",
        children:[
        {
            value: "Kulumootjad PK5", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK5 kulumootja [m3]",
                    label: "Puurkaev PK5 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK7",
        label: "Puurkaev PK7",
        children:[
        {
            value: "Kulumootjad PK7", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK7 kulumootja [m3]",
                    label: "Puurkaev PK7 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Puurkaev PK8",
        label: "Puurkaev PK8",
        children:[
        {
            value: "Kulumootjad PK8", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Puurkaev PK8 kulumootja [m3]",
                    label: "Puurkaev PK8 kulumootja [m3]"
                }
            ]
        }
        ]
    },
    {
        value: "Veepuhastusjaam",
        label: "Veepuhastusjaam",
        children:[
        {
            value: "Kulumootjad", 
            label: "Kulumootjad",
            children:[
                {
                    value: "Veepuhastusjaama valjundi kulumootja [m3]",
                    label: "Veepuhastusjaama valjundi kulumootja [m3]"
                }
            ]},
            {
                value: "Mootorite statiistika", 
                label: "Mootorite statiistika",
                children:[
                    {
                        value: "Filtrite puhuri BWBBL01 kaivitused",
                        label: "Filtrite puhuri BWBBL01 kaivitused"
                    }
                ]
            }
            ]
    },
    
    ]
    
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html,"text/html")
        return doc.body.textContent
      }
     // get filters data
    const handleSubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.post("/data/all", {checked})
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
        <CheckboxTree 
            checked={checked}
            expanded={expanded}
            nodes={tests}
            onCheck={onCheck}
            onExpand={onExpand}
        />  

</div>
        <div>
        <button onClick={handleSubmit}>GetData</button>
                {err &&<p>{err}</p>}
        </div>               
        <div>
            <div className='home'>
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
</div> 
    );
}

export default Home