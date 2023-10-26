import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import axios from "axios"
import CheckboxTree from "react-checkbox-tree"


const Home = () => {
    /*const [tags, setTags] = useState([]);
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
        
    },);*/
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
            value: "Kukumootjad PK2", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK2 Kukumootjad [kWh]",
                    label: "Puurkaev PK2 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK3", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK3 Kukumootjad [kWh]",
                    label: "Puurkaev PK3 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK1", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK1 Kukumootjad [kWh]",
                    label: "Puurkaev PK1 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK4", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK4 Kukumootjad [kWh]",
                    label: "Puurkaev PK4 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK5", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK5 Kukumootjad [kWh]",
                    label: "Puurkaev PK5 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK7", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK7 Kukumootjad [kWh]",
                    label: "Puurkaev PK7 Kukumootjad [kWh]"
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
            value: "Kukumootjad PK8", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Puurkaev PK8 Kukumootjad [kWh]",
                    label: "Puurkaev PK8 Kukumootjad [kWh]"
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
            value: "Kukumootjad", 
            label: "Kukumootjad",
            children:[
                {
                    value: "Veepuhastusjaama valjundi kukumootja [m3]",
                    label: "Veepuhastusjaama valjundi kukumootja [m3]"
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
     
        
    
      const [checked, setChecked] = useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = useState([
        '/app'
    ]);

    const onCheck = (value) => {
        setChecked(value);
    };

    const onExpand = (value) => {
        setExpanded(value);
    };

    return (
        <CheckboxTree
            checked={checked}
            expanded={expanded}
            nodes={tests}
            onCheck={onCheck}
            onExpand={onExpand}
        />
    );
        
    
    
    /*return (
        <div className='home'>
           <div className="posts">
           
           {tags.map((tag)=>(
                <div className="post" key={tag.Area}>
                    
                    <div className="content">
                       
                            <h1>{tag.Group}</h1>
                            <h1>{tag.Area}</h1>
                            <p>{getText(tag.Description)}</p>
                            
                        
                    </div>
                </div>
            ))}
            </div> 
        </div>
    )*/

    
}

export default Home