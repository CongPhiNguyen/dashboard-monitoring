import React, { useState, useEffect } from 'react'
import { Select, Row, Col } from 'antd';
import ReactApexChart from "react-apexcharts"
import TableVUI from './TableVUI';
import BalanceVUI from './BalanceVUI';
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
const { Option } = Select;
export default function Dashboard() {
    const [option1, setOption1] = useState("week")
    const [option2, setOption2] = useState("all")
    const [dayOfWeek, setDayOfWeek] = useState([])

    useEffect(() => {
        let currentDay = new Date()
        let days = []
        days.push(`${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`)
        for (let i = 1; i <= 6; i++) {
            let newDay = new Date()
            newDay.setDate(currentDay.getDate() - i)
            days.unshift(`${newDay.getDate()}/${newDay.getMonth() + 1}/${newDay.getFullYear()}`)
        }
        setDayOfWeek(days)
    }, [])

    const handleChange = (value) => {
        setOption1(value)
    };
    const handleChange1 = (value) => {
        setOption2(value)
    };
    const arr = new Array(24).fill(0)
    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
    const series = [
        {
            name: 'Plus VUI',
            data: series1,
        }, {
            name: 'Minus VUI',
            data: series2
        }
    ]
    const state = {
        series,
        options: {
            chart: {
                type: 'area',
                stacked: false,
                height: 700,
                width: 1400,
                zoom: {
                    enabled: false
                },

            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            annotations: {
                yaxis: [{
                    y: 30,
                    borderColor: '#999',
                    label: {
                        show: true,
                        text: 'Time',
                        style: {
                            color: "#fff",
                            background: '#00E396'
                        }
                    }
                }],
                xaxis: [{
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'VUI',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    }
                }]
            },
            title: {
                text: 'VUI Chart',
                align: 'left'
            },
            stroke: {
                curve: 'smooth'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100]
                },
            },
            colors: ['#a0d911', "#ff4d4f"],
            yaxis: {
                title: {
                    text: 'Vui'
                },
            },
            xaxis: {
                categories,
            },
            tooltip: {
                enabled: true,
                shared: true,
                y: {
                    formatter: function (val) {
                        return val
                    }
                },
                x: {
                    format: 'dd/MM/yy HH:mm',
                    formatter: function (value) {
                        console.log(value);
                        if (option1 === "week") {
                            return categories[value - 1]
                        } else if (option1 !== "weel" && option2 === "all") {
                            return `${option1} ${value}:00`
                        } else {
                            return `${option1} ${option2}:${value}`
                        }
                    }
                },
            },
            responsive: [
                {
                    breakpoint: 1400,
                    options: {
                        chart: {
                            height: 500,
                            width: 1000,
                        }
                    }
                },
                {
                    breakpoint: 1300,
                    options: {
                        chart: {
                            height: 500,
                            width: 900,
                        }
                    }
                },
                {
                    breakpoint: 1200,
                    options: {
                        chart: {
                            height: 500,
                            width: 800,
                        }
                    }
                },
                {
                    breakpoint: 1100,
                    options: {
                        chart: {
                            height: 500,
                            width: 700,
                        }
                    }
                },
                {
                    breakpoint: 1000,
                    options: {
                        chart: {
                            height: 500,
                            width: 600,
                        }
                    }
                },
                {
                    breakpoint: 900,
                    options: {
                        chart: {
                            height: 500,
                            width: 500,
                        }
                    }
                },
                {
                    breakpoint: 700,
                    options: {
                        chart: {
                            height: 300,
                            width: 400,
                        }
                    }
                },
                {
                    breakpoint: 500,
                    options: {
                        chart: {
                            height: 200,
                            width: 200,
                        }
                    }
                },
            ]

        },
    };

    const renderWeek = () => {
        setSeries1([23, 34, 52, 13, 52, 22, 90])
        setSeries2([34, 213, 23, 124, 232, 12, 42])
        let currentDay = new Date()
        let arrCategories = []
        arrCategories.push(`${currentDay.getDate()}/${currentDay.getMonth() + 1}/${currentDay.getFullYear()}`)
        for (let i = 1; i <= 6; i++) {
            let newDay = new Date()
            newDay.setDate(currentDay.getDate() - i)
            arrCategories.unshift(`${newDay.getDate()}/${newDay.getMonth() + 1}/${newDay.getFullYear()}`)
        }
        setCategories(arrCategories)
    }

    const renderDay = () => {
        let arr = new Array(24).fill(0)
        setSeries1([23, 34, 52, 13, 52, 22, 90, 23, 34, 52, 13, 52, 22, 90, 23, 34, 52, 13, 52, 22, 90, 23, 12, 52])
        setSeries2([34, 213, 23, 124, 232, 12, 42, 34, 213, 23, 124, 232, 12, 42, 34, 213, 23, 124, 232, 12, 42, 42, 34])
        let cate = arr.map((value, key) => {
            return key
        })
        setCategories(cate)
    }

    const renderHours = () => {
        let arr = new Array(60).fill(0)
        let valueSeries1 = arr.map(value => {
            return randomIntFromInterval(0, 100)
        })
        let valueSeries2 = arr.map(value => {
            return randomIntFromInterval(0, 100)
        })
        setSeries1(valueSeries1)
        setSeries2(valueSeries2)

        let cate = arr.map((value, key) => {
            return key
        })
        setCategories(cate)
    }

    useEffect(() => {
        if (option1 === "week") {
            renderWeek()
        } else if (option1 !== "weel" && option2 === "all") {
            renderDay()
        } else {
            renderHours()
        }
    }, [option1, option2])


    return (
        <>
            <div className='flex justify-start'>
                <Select
                    value={option1}
                    style={{
                        width: 120,
                        marginRight: '12px'
                    }}
                    onChange={handleChange}
                >
                    <Option value="week">Week</Option>
                    {
                        dayOfWeek.map((value, index) => {
                            return (<Option key={index} value={value}>{value}</Option>)
                        })
                    }
                </Select>
                <Select
                    value={option2}
                    style={{
                        width: 120,
                    }}
                    disabled={option1 === "week" ? true : false}
                    onChange={handleChange1}
                >
                    <Option value="all">All</Option>
                    {
                        arr.map((value, key) => (
                            <Option value={key}>{key}</Option>
                        ))
                    }
                </Select>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <ReactApexChart options={state.options} series={state.series} height={500} width={1200} type="area" />
            </div>
            <Row className='mt-3' gutter={[16, 16]}>
                <Col xl={12} md={24}>
                    <TableVUI plusVui={series1} minusVui={series2} categories={categories}></TableVUI>
                </Col>
                <Col xl={12} md={24}>
                    <BalanceVUI plusVui={series1} minusVui={series2} ></BalanceVUI>
                </Col>
            </Row>
        </>
    )
}
