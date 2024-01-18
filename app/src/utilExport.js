import * as XLSX from 'xlsx';
 export function  readExcel(file){
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
    reader.onload = (e)=> {
      const binaryString = e.target?.result;
      const workbook = XLSX.read(binaryString, {
        type: 'binary',
        cellDates: true,
      });
     const workSheetName = workbook.SheetNames[0]; // first sheet
     const workSheet = workbook.Sheets[workSheetName];
     const data= XLSX.utils.sheet_to_json(workSheet, { raw: true });
     resolve(data)
    };
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsBinaryString(file);
    })
  }