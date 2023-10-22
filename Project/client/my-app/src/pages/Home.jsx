import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import axios from "axios"


const Home = () => {
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
    /*const tags =
    [
        {
            area: "Here",
            group: "title",
            description: "hello"
        },
        {
            area: "Here",
            group: "title",
            description: "hello"
        },
        {
            area: "Here",
            group: "title",
            description: "hello"
        },
    ];*/
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html,"text/html")
        return doc.body.textContent
      }
    return (
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
    )
    
}
export default Home