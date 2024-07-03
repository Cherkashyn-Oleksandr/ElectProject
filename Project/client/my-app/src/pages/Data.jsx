import React, { useEffect, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { Chart } from "react-google-charts";
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';
import {useNavigate} from "react-router-dom"


const Data = () =>{
    let exportColumns = []
    const navigate = useNavigate()
    // create dates array
    const [dateTime, setDateTime] = useState('');
    let columns = [] //columns for table
    let chartArray = [] //Array for chart
    var Dates = JSON.parse(sessionStorage.getItem('Dates')) //dates for chart option
    var AllData = JSON.parse(sessionStorage.getItem('Array')) //data for table
    if(AllData != null){
        columns = Object.keys(AllData[0]).map(key => ({
        field: key,
        header: key
    }));
    chartArray = transformArray(AllData)
    exportColumns = columns.map((col) => ({ title: col.header, dataKey: col.field }));
}
    // create csv
    const dt = useRef(null);
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };
    const exportPdf = () => {
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);

                doc.autoTable(exportColumns, AllData, {
                    margin: 1,
                    styles: { overflow: 'linebreak' },
                    horizontalPageBreak:true
                });
                doc.save(`Raport ${dateTime}.pdf`);
            });
        });
    };
    // create excel file 
    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(AllData);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });
            saveAsExcelFile(excelBuffer, `Raport ${dateTime}`);
        });
    };
    // save excel file
    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });
                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };
    //create header for primetable
    const header = (
        <div className="flex align-items-center justify-content-end gap-2">
            <Button type="button" icon="pi pi-file" rounded onClick={() => exportCSV(false)} data-pr-tooltip="CSV" />
            <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
<Button type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
        </div>
    );
  // func for getting current date
  useEffect(() => {
    const getCurrentDateTime = () => {
      const now = new Date();
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const date = `${day}.${month}.${now.getFullYear()}`;
      const time = `${hour}:${minute}`;
      return `${date} ${time}`;
    };
    setDateTime(getCurrentDateTime());
  }, []);
  //back to homepage button func
  const handleSubmit = async ()=>{
    try{
        navigate("/")
    }
    catch(err){
        console.log(err)
    }
  }
    //options for googlecharts
    const options = {
        chart: {
          title: "Objekt",
          //subtitle: "15.4.2024 - 17.4.2024",
        },
      };

//func for creating chart array
function transformArray(originalArray) {
    // Collect headers
    console.log(originalArray[0])
    const headers = Object.keys(originalArray[0]).filter(key => key.includes("-"));
    // Create new array
    const newArray = [["Kuupaev", ...headers]];
    originalArray.forEach(item => {
        const row = [item["Kuupaev"]];
        // Get data from array and convert to float
        headers.forEach(header => {
            row.push(parseFloat(item[header]));
        });
        newArray.push(row);
    });
    return newArray;
}
    return(
    <div>
        <div>
        <div className="App">
      <h1 style={{ textAlign: 'center' }}>Firma nimi</h1>
      <div style={{ textAlign: 'left', marginLeft: '20px' }}>
        <button onClick={handleSubmit} alt="">Tagasi</button>
      </div>
      <h2 style={{ textAlign: 'center' }}>Raport {dateTime}</h2>
    </div>
        <div className="card">
        <Tooltip target=".export-buttons>button" position="bottom" />
        <DataTable ref={dt} value={AllData} header={header} className="datatable-responsive" removableSort 
        stripedRows showGridlines paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
        tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} sortable/>
                ))}
            </DataTable>
        </div>
        <div>
        <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={chartArray}
      options={options}
    />
        </div>
       
        </div>
    </div>
    );
}
export default Data