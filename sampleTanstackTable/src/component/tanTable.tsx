import { SClass1, SClass2 } from "./mainCompo"
import React, { SetStateAction, useState } from 'react';
import {
  CellContext,
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

type TableComponentProps = {
  tableData: OneRow[],
  setTableData: React.Dispatch<React.SetStateAction<OneRow[]>>;
}

type TableData = {
  plan: SClass1[],
  actual: SClass1[],
  sub: SClass2[]
}

export type OneRow = {
  plan: SClass1,
  actual: SClass1,
  sub: SClass2
}




type handleValue1Change<T> = {
  index: number,
  inputValue: T,
  column: string

}

type PlanValue1EditCellProps<T> = {
  column: string,
  value: T,
  rowIndex: number
  handleValue1Change: (data: handleValue1Change<T>) => void;
}

type DualEditCellProps<T1,T2> ={
  column1:string,
  column2:string,
  rowIndex:number,
  value1:T1,
  value2:T2,
  handleValueChange1: (data:handleValue1Change<T1>) => void;
  handleValueChange2: (data:handleValue1Change<T2>) => void;
}

const PlanValue1EditCell = (cellData: PlanValue1EditCellProps<string>) => {
  const [inputValue, setInputValue] = useState(cellData.value);

  const handleBlur = () => {
    cellData.handleValue1Change({ index: cellData.rowIndex, inputValue: inputValue, column: cellData.column });
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};


const PlanValue1EditCellNumber = (cellData: PlanValue1EditCellProps<number>) => {
  const [inputValue, setInputValue] = useState(cellData.value.toString());
  const [isError, setError] = useState<boolean>(false);
  const handleBlur = () => {

    if (!Number.isNaN(inputValue) && Number.isFinite(inputValue)) {
      setError(false);
      cellData.handleValue1Change({ index: cellData.rowIndex, inputValue: Number(inputValue), column: cellData.column });
    } else {
      setError(true);
      setInputValue(inputValue);
    }

  };

  return (
    <input
      className={isError ? `text-error` : ""}
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

const PlanValue1EditCellDate = (cellData: PlanValue1EditCellProps<Date>) => {
  const initialDate = cellData.value ? cellData.value.toISOString().split('T')[0] : '';
  const [inputValue, setInputValue] = useState(initialDate);
  const handleBlur = () => {

    cellData.handleValue1Change({ index: cellData.rowIndex, inputValue: new Date(inputValue), column: cellData.column });

  };

  return (
    <input
      type="date"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={handleBlur}
    />
  );
};

const EditCellDual = (cellInf:DualEditCellProps<string,number>)=>{
  const initialValue1= cellInf.value1 ? cellInf.value1:"";
  const initialValue2 = cellInf.value2 ? cellInf.value2.toString():"";
  const [inputValue1, setInputValue1] = useState(initialValue1);
  const [inputValue2, setInputValue2] = useState(initialValue2);
  const handleBlur1 = () => {

    cellInf.handleValueChange1({ index: cellInf.rowIndex, inputValue: inputValue1, column: cellInf.column1 });

  };

  const handleBlur2 = () => {

    cellInf.handleValueChange2({ index: cellInf.rowIndex, inputValue: Number(inputValue2), column: cellInf.column2 });

  };
  return (
    <>
    <input
      type="text"
      value={inputValue1}
      onChange={(e) => setInputValue1(e.target.value)}
      onBlur={handleBlur1}
    />
        <input
      type="text"
      value={inputValue2}
      onChange={(e) => setInputValue2(e.target.value)}
      onBlur={handleBlur2}
    />
    </>
  );
  
}



const PlanIdCell = ({ value }: { value: number }) => <span>{value}</span>;
const PlanClassIdCell = ({ value }: { value: number }) => <span>{value}</span>;
const PlanValue1Cell = ({ value }: { value: string }) => <span>{value}</span>;
const PlanValue2Cell = ({ value }: { value: string }) => <span>{value}</span>;
const OrignalCell = ({ inf }: { inf: CellContext<OneRow, unknown> }) => (<><div>{inf.row.original.plan.classId as number}</div><div>{inf.row.original.plan.value1}</div></>)

const TableComponent = (prop: TableComponentProps) => {
  //const sampleData = prop.data;

  // const rowsData:OneRow[] = sampleData.plan.map((data,idx)=>{
  //     return {
  //         plan:data,
  //         actual:sampleData.actual[idx],
  //         sub:sampleData.sub[idx],
  //     }
  // })

  const handleValue1ChangePlan = ({ index: rowIndex, inputValue: newValue, column: column }: handleValue1Change<string>) => {
    const newData = [...rowsData];
    newData[rowIndex].plan = { ...newData[rowIndex].plan, [column]: newValue };
    setRowsData(newData);
    prop.setTableData(newData); // 親コンポーネントのデータも更新
  };

  const handleValueChangePlanNumber = ({ index: rowIndex, inputValue: newValue, column: column }: handleValue1Change<number>) => {
    const newData = [...rowsData];
    newData[rowIndex].plan = { ...newData[rowIndex].plan, [column]: newValue };
    setRowsData(newData);
    prop.setTableData(newData); // 親コンポーネントのデータも更新
  };

  const handleValueChangeSubDate = ({ index: rowIndex, inputValue: newValue, column: column }: handleValue1Change<Date>) => {
    const newData = [...rowsData];
    newData[rowIndex].sub = { ...newData[rowIndex].sub, [column]: newValue };
    setRowsData(newData);
    prop.setTableData(newData); // 親コンポーネントのデータも更新
  };


  const [rowsData, setRowsData] = useState<OneRow[]>(prop.tableData);

  const columns = React.useMemo<ColumnDef<OneRow>[]>(() => [

    {
      header: "Info",
      columns: [
        {
          header: "オリジナル",
          cell: (info) => <OrignalCell inf={info} />
        },
        {
          header: 'planのID',
          accessorFn: row => row.plan.id,
          cell: info => <PlanIdCell value={info.getValue() as number} />,
        },
        {
          header: 'Class ID',
          accessorFn: row => row.plan.classId,
          //cell: info => <PlanClassIdCell value={info.getValue() as number } />,
          cell: info => <PlanValue1EditCellNumber column={"classId"} value={info.getValue() as number} rowIndex={info.row.index} handleValue1Change={handleValueChangePlanNumber} />
        },
        {
          header: 'Value 1',
          accessorFn: row => row.plan.value1,
          cell: info => <PlanValue1EditCell column={"value1"} value={info.getValue() as string} rowIndex={info.row.index} handleValue1Change={handleValue1ChangePlan} />,
        },
        {
          header: 'Value 2',
          accessorFn: row => row.plan.value2,
          cell: info => <PlanValue2Cell value={info.getValue() as string} />,
        },
        {
          header: 'Actual ID',
          accessorFn: row => row.actual.id,
        },
        {
          header: 'Actual Class ID',
          accessorFn: row => row.actual.classId,
        },
        {
          header: 'Actual Value 1',
          accessorFn: row => row.actual.value1,
        },
        {
          header: 'Actual Value 2',
          accessorFn: row => row.actual.value2,
        },
        {
          header: 'Sub ID',
          accessorFn: row => row.sub.id,
        },
        {
          header: 'Sub Class ID',
          accessorFn: row => row.sub.classId,
        },
        {
          header: 'Sub Value 1',
          accessorFn: row => row.sub.value1,
        },
        {
          header: 'Sub Value 2',
          accessorFn: row => row.sub.value2,
          cell: info => <PlanValue1EditCellDate column="value2" value={info.getValue() as Date} rowIndex={info.row.index} handleValue1Change={handleValueChangeSubDate} />
        },
        {
          header: 'Sub Value 3',
          accessorFn: row => row.sub.value3,
        },
      ]
    },
    {
      header: "複合テーブル",
      columns: [
        {
          header: '複合1',
          accessorFn: row => row.sub.value3,
        },
        {
          header: '複合2',
          accessorFn: row => row.sub.value2,
        },
        {
          header:"plan_value1,2",
          cell:info=> <EditCellDual column1="value1" column2="classId" rowIndex={info.row.index} value1={info.row.original.plan.value1} value2={info.row.original.plan.classId} handleValueChange1={handleValue1ChangePlan} handleValueChange2={handleValueChangePlanNumber} />
          
        }
      ]
    },
  ], []);

  const data = React.useMemo(() => rowsData, []);


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                // <th key={header.id} colSpan={header.colSpan}>
                //   {flexRender(header.column.columnDef.header, header.getContext())}
                // </th>
                <th key={header.id} colSpan={header.colSpan}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};



export default TableComponent;
