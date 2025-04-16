import {options} from "../db.js";
import fb from "node-firebird"
import { prepTree, prepData  } from "./sqlDataConvert.js";
import { splitArray } from "./data.js";

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

export const getValues = async (req, res) => {
    if (!req.body.checked || !req.body.checked.length) {
        return res.status(400).json("Select objects");
    }

    if (req.body.formattedFilters.StartDate >= req.body.formattedFilters.EndDate) {
        return res.status(400).json("Wrong time period");
    }

    const tagArray = splitArray(req.body.checked);

    try {
        const promises = tagArray.map((tag) => {
            return new Promise((resolve, reject) => {
                fb.attach(options, (err, con) => {
                    if (err) return reject(err);

                    const query = `SELECT f.Name AS Firma, c.Card_ID as Kaardi_number, s.Address AS Objekt, d.LOG_TIMESTRING as Kuupaev,  d.LOG_VALUE as kogus
                        FROM PS_DATA d
                        JOIN Stations s ON d.Station_id = s.Number
                        JOIN Cards c ON d.LOG_CARD_ID = c.Card_ID
                        JOIN Firms f ON c.Firm_ID = f.Firm_ID 
                        WHERE s.Address = ? AND c.Card_ID = ? AND d.TIMESTRING >= ? AND d.TIMESTRING <= ?`;

                    con.query(query, [tag.Group, tag.Description, req.body.formattedFilters.StartDate, req.body.formattedFilters.EndDate], (err, result) => {
                        if (err) return reject(err);
                        resolve(result);
                    });
                });
            });
        });

        const allResults = await Promise.all(promises);
        const results = prepData(allResults.flat());
        return res.status(200).json(results);
    } catch (error) {
        console.error("Database Err:", error);
        return res.status(500).json({ error: "Internal server error", details: error });
    }
};
