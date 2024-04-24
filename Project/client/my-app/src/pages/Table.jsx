import React, {useState} from "react"
import axios from "axios"
const Table = () =>{
    const [err,setError] = useState(null)
    const [Dates, setDate] = useState([])
    
    const handleSubmit = async e =>{
        e.preventDefault()
        try{
         const res = await axios.get("http://localhost:8800/api/data/table")
         let arr = [...Object.values(res.data.data.ee)];
        setDate(arr)
    }
        catch(err){
            setError(err.response.data)
    }
    }
    return (
        <div>
            <div>
            <button onClick={handleSubmit}>Get Price</button>
            {err &&<p>{err}</p>}
        </div>
        {Dates.map((data)=>(
                <div>
                    {data.price}
                </div>
                ))}
        </div>
    );
}
export default Table