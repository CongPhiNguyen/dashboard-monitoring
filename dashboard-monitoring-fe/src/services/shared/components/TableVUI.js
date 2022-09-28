import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs"
const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Using VUI',
        dataIndex: 'using',
        sorter: {
            compare: (a, b) => a.using - b.using,
        },
        render: (text) => <div className='flex justify-start items-center'>
            <p className='text-[#a0d911] font-bold m-0'>{text}</p>
            <BsArrowUpShort className='text-[2rem] text-[#a0d911]' />
        </div>,
    },
    {
        title: 'Giving VUI',
        dataIndex: 'giving',
        sorter: {
            compare: (a, b) => a.giving - b.giving,
        },
        render: (text) => <div className='flex justify-start items-center'>
            <p className='text-[#ff4d4f]  font-bold m-0'>{text}</p>
            <BsArrowDownShort className='text-[2rem] text-[#ff4d4f]' />
        </div>,
    },
];


const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const TableVUI = (props) => {
    const renderDate = (date) => {
        // if (props.type === "week") {
        // let [day, month, year] = date.split("/")
        console.log(date.split("/"))
        let a = new Date(date)
        return a.getDate() + "/" + (a.getMonth() + 1) + "/" + a.getFullYear() + " " + a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds()
    }

    const [data, setData] = useState([])
    useEffect(() => {
        if (data.length !== 0) {
            setData(props.categories.map((value, key) => {
                return {
                    key: key,
                    date: renderDate(props.categories[key]),
                    using: props.using[key],
                    giving: props.giving[key],
                }
            }))
        }
        if (props.categories.length !== 0) {
            setData(prev => {
                return [{
                    key: props.categories.length,
                    date: renderDate(props.categories[props.categories.length - 1]),
                    using: props.using[props.using.length - 1],
                    giving: props.giving[props.giving.length - 1],
                }, ...prev]
            })
        }
    }, [props.categories, props.using, props.giving, data.length])
    return (
        <Table columns={columns} dataSource={data} onChange={onChange} />
    )
}
export default TableVUI;