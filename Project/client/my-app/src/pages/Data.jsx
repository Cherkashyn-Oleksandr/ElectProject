import React, { useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-cyan/theme.css';


const Data = () =>{
    let convertedArray = []
    var sessionString = sessionStorage.getItem('Array')
    var AllData = JSON.parse(sessionString)
    if(AllData != null){
        convertedArray = Object.keys(AllData[0]).map(key => ({
        field: key,
        header: key
    }));
}
    const array = [
        {
            Kuupaev:"15.3.2024",
            "Puurkaev PK1/kulumootjad":"",
            "Puurkaev PK1 kulumootja [m3]":5,
            "Puurkaev PK1 kulumootja [m3] Loendur":42.23,
            "Puurkaev PK4/kulumootjad":"",
            "Puurkaev PK4 kulumootja [m3]":5,
            "Puurkaev PK4 kulumootja [m3] Loendur":31.23
        },
        {
            Kuupaev:"16.3.2024",
            "Puurkaev PK1/kulumootjad":"",
            "Puurkaev PK1 kulumootja [m3]":6,
            "Puurkaev PK1 kulumootja [m3] Loendur":48.23,
            "Puurkaev PK4/kulumootjad":"",
            "Puurkaev PK4 kulumootja [m3]":4,
            "Puurkaev PK4 kulumootja [m3] Loendur":35.23
        },
        {
            Kuupaev:"17.3.2024",
            "Puurkaev PK1/kulumootjad":"",
            "Puurkaev PK1 kulumootja [m3]":7,
            "Puurkaev PK1 kulumootja [m3] Loendur":55.23,
            "Puurkaev PK4/kulumootjad":"",
            "Puurkaev PK4 kulumootja [m3]":8,
            "Puurkaev PK4 kulumootja [m3] Loendur":43.23
        }
    ]
    const columns = [
        {field: 'Kuupaev', header: 'Kuupaev'},
        {field: 'Puurkaev PK1/kulumootjad', header: 'Puurkaev PK1/kulumootjad'},
        {field: 'Puurkaev PK1 kulumootja [m3]', header: 'Puurkaev PK1 kulumootja [m3]'},
        {field: 'Puurkaev PK1 kulumootja [m3] Loendur', header: 'Loendur'},
        {field: 'Puurkaev PK4/kulumootjad', header: 'Puurkaev PK4/kulumootjad'},
        {field: 'Puurkaev PK4 kulumootja [m3]', header: 'Puurkaev PK4 kulumootja [m3]'},
        {field: 'Puurkaev PK4 kulumootja [m3] Loendur', header: 'Loendur'}
    ];
    const getText = (html) =>{
        const doc = new DOMParser().parseFromString(html,"text/html")
        return doc.body.textContent
      }
   
    return(
    <div>
        <div>
        
        <div className="card">
        <DataTable value={AllData} className="datatable-responsive" removableSort 
        stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
        tableStyle={{ minWidth: '50rem' }}>
                {convertedArray.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} sortable/>
                ))}
            </DataTable>
        </div>
    
       
        </div>
    </div>
    );
}
export default Data