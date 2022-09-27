import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs"
const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Plus VUI',
        dataIndex: 'plusVui',
        sorter: {
            compare: (a, b) => a.plusVui - b.plusVui,
            // multiple: 2,
        },
        render: (text) => <div className='flex justify-start items-center'>
            <p className='text-[#a0d911] font-bold m-0'>{text}</p>
            <BsArrowUpShort className='text-[2rem] text-[#a0d911]' />
        </div>,
    },
    {
        title: 'Minus VUI',
        dataIndex: 'minusVui',
        sorter: {
            compare: (a, b) => a.minusVui - b.minusVui,
            // multiple: 1,
        },
        render: (text) => <div className='flex justify-start items-center'>
            <p className='text-[#ff4d4f]  font-bold m-0'>{text}</p>
            <BsArrowDownShort className='text-[2rem] text-[#ff4d4f]' />
        </div>,
    },
];

// const data = [
//     {
//         key: 1,
//         date: "12 / 2 / 2022",
//         plusVui: 50,
//         minusVui: 60,
//     },
//     {
//         key: 2,
//         date: "13 / 2 / 2022",
//         plusVui: 150,
//         minusVui: 90,
//     },
//     {
//         key: 3,
//         date: "14 / 2 / 2022",
//         plusVui: 80,
//         minusVui: 60,
//     },
//     {
//         key: 4,
//         date: "12 / 2 / 2022",
//         plusVui: 20,
//         minusVui: 40,
//     },
// ]

const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const TableVUI = (props) => {

    const renderDate = (date) => {
        let a = new Date(date)
        return a.getDate() + "/" + (a.getMonth() + 1) + "/" + a.getFullYear() + " " + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds()
    }

    const [data, setData] = useState([])
    useEffect(() => {
        if (props.categories.length !== 0) {
            setData(prev => {
                return [{
                    key: props.categories.length,
                    date: renderDate(props.categories[props.categories.length - 1]),
                    plusVui: props.plusVui[props.plusVui.length - 1],
                    minusVui: props.minusVui[props.minusVui.length - 1],
                }, ...prev]
            })
        }
    }, [props.categories])
    return (
        <Table columns={columns} dataSource={data} onChange={onChange} />
    )
}
export default TableVUI;