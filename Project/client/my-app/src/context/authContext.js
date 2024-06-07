import axios from 'axios';
import {createContext, useEffect, useState} from 'react';

export const AuthContext = createContext() //create context

export const AuthContextProvider = ({children})=>{
const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user") || null))
// login user
const login = async(inputs)=>{
    const res = await axios.post("http://localhost:8800/api/data/login",inputs);
    setCurrentUser(res.data);
};

useEffect(()=>{
    localStorage.setItem("user",JSON.stringify(currentUser));
}, [currentUser]);

return <AuthContext.Provider value={{currentUser, login}}>{children}</AuthContext.Provider>
}