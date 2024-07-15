import TableComponent, { OneRow } from "./tanTable"
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'


export type SClass1 = {
    id: number,
    classId: number,
    value1: string,
    value2: string
}

export type SClass2 = {
    id: number,
    classId: number,
    value1: number,
    value2: Date,
    value3: string

}


export const MainComp = () => {

    const sClass1Samples: SClass1[] = [
        {
            id: 1,
            classId: 101,
            value1: "sampleValue1-1",
            value2: "sampleValue2-1"
        },
        {
            id: 2,
            classId: 102,
            value1: "sampleValue1-2",
            value2: "sampleValue2-2"
        }
    ];

    const sClass1Samples2: SClass1[] = [
        {
            id: 1,
            classId: 101,
            value1: "sampleValue1-1",
            value2: "sampleValue2-1"
        },
        {
            id: 2,
            classId: 102,
            value1: "sampleValue1-2",
            value2: "sampleValue2-2"
        }
    ];


    const sClass2Samples: SClass2[] = [
        {
            id: 1,
            classId: 101,
            value1: 123,
            value2: new Date("2024-07-14"),
            value3: "sampleValue3"
        },
        {
            id: 2,
            classId: 102,
            value1: 123,
            value2: new Date("2024-07-14"),
            value3: "sampleValue3"
        }
    ]


    const [plans, setPlans] = useState<SClass1[]>(sClass1Samples);
    const [actuals, setActuals] = useState<SClass1[]>(sClass1Samples2);
    const [subs, setSubs] = useState<SClass2[]>(sClass2Samples);

    const docData: OneRow[] = plans.map((plan, idx) => {
        return {
            plan: plan,
            actual: actuals[idx],
            sub: subs[idx],
        }
    })

    const [tableData,setTableData] = useState<OneRow[]>(docData);


    return (
        <>
            <div>テーブル</div>
            <TableComponent tableData={tableData} setTableData={setTableData} />
        </>
    )
}