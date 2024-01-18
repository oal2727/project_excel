import { useState,useEffect,useRef } from 'react'
import './App.css'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  
} from '@tanstack/react-table'
import { readExcel } from './utilExport';
import Modal from './components/Modal';

function App() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpload,setUploadingUpload] = useState(false)

  const listData =()=>{
    fetch('http://localhost:5000/api/list')
    .then(response => {
      if (!response.ok) {
        alert('Error al obtener los datos');
        // throw new Error('La red de respuesta no fue ok');
      }
      return response.json();
    })
    .then(data => {
      setData(data);
      setLoading(false);
    })
  }

  useEffect(() => {
    listData()
  }, []); 

  
  const columnHelper = createColumnHelper()
  
  const columns = [
    columnHelper.accessor('numberCertificate', {
      header: () => 'Numero Certificado',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('contract', {
      header: () => 'Contrato Propuesto',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('question1', {
      header: () => 'Pregunta 1',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),

    columnHelper.accessor('question2', {
      header: () => 'Pregunta 2',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('question3', {
      header: () => 'Pregunta 3',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('question4', {
      header: () => 'Pregunta 4',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('question5', {
      header: () => 'Pregunta 5',
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })


  const fileInputRef = useRef(null);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  

  const sendData =(response)=>{
    fetch('http://localhost:5000/api/save',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    }).then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          return Promise.reject(err); 
        });
      }
      return response.json(); 
    }).then(() => {
      alert('Agregado Correctamente');
      listData()
    }).catch((err) => {
      console.log(err)
      alert(err.message)
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setUploadingUpload(true)
    readExcel(file).then((response)=>{
      setUploadingUpload(false)
      sendData(response)
    })
  };

  return (
    <>
    {
      (loadingUpload) && <Modal/>
    }
    <button 
    onClick={handleClick}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Exportar Excel
    </button>
    <input type="file" 
    className="hidden"
      ref={fileInputRef}
      accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      onChange={handleFileChange}
    />
    <p>{(loading) && "Loading"}</p>
    <div className="my-2 text-left p-2">
      <ul className="text-gray-400">
        <li>Pregunta si : obtener la descripción ingresada</li>
        <li>No se ha encontrado la respuesta se define como vacio</li>
      </ul>
    </div>
        <table className="w-full table-fixed mt-2">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map(header => (
                <th key={header.id} className="w-1/4 py-2 px-4 text-left text-gray-600 font-bold uppercase">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody  className="bg-white">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}  className="py-2 px-4 border-b border-gray-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-2">
        <button
          className="cursor-pointer hover:text-white border rounded-md bg-gray-300 p-2 hover:bg-gray-400"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="cursor-pointer hover:text-white border rounded-md bg-gray-300 p-2 hover:bg-gray-400"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="cursor-pointer hover:text-white border rounded-md bg-gray-300 p-2 hover:bg-gray-400"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="cursor-pointer hover:text-white border rounded-md bg-gray-300 p-2 hover:bg-gray-400"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Pagina</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} de {' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
        className="border rounded-md bg-gray-200 p-2"
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default App
