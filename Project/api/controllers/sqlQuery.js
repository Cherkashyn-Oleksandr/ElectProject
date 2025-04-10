import {options} from "../db.js";
import fb from "node-firebird"
import { prepTree } from "./sqlDataConvert.js";

export const getTreeView = async (req,res) => {
    let treeArray = []
    fb.attach(options, (err,con) => {
        if (err) return res.status(500).json(err);
        con.query(`SELECT s.Address AS Station_Address, f.Name AS Firm_Name, c.Card_ID 
            FROM Cards c 
            JOIN Firms f ON c.Firm_ID = f.Firm_ID 
            JOIN Stations s ON c.Station_id = s.Number;`, 
            function (err,result){
            if (err) return res.status(500).json(err);
            treeArray = prepTree(result)
            return res.status(200).json(treeArray)
        })
        
    })
        
    
}