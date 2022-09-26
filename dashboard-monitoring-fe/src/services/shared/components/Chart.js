import React, { useEffect, useState, useRef } from 'react';
import ReactApexChart from "react-apexcharts"
import { getAccessToken } from '../../../helper/Cookies';
import { Radio } from 'antd';
import TableVUI from './TableVUI';
import socketIOClient from 'socket.io-client';
const host = 'http://localhost:5050'
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function Chart() {
    const socketRef = useRef()
    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)

        socketRef.current.on('connect', function () {
            console.log(getAccessToken())
            socketRef.current.emit('authenticate', { token: getAccessToken() });
        });

        socketRef.current.on('getData', (data) => {
            console.log(data)
            let nowTime = new Date()
            setSeries1(prev => {
                return [...prev.slice(0), data.plusVui];
            })
            setSeries2(prev => {
                return [...prev.slice(0), data.minusVui];
            })
            setCategories(prev => {
                return [...prev.slice(0), data.date]
            })
        })

        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    const [selected, setSelected] = useState('week');
    const onChange = (e) => {
        setSelected(e.target.value);
    };
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
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
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
                type: 'datetime',
                categories,
            },
            tooltip: {
                enabled: true,
                y: {
                    formatter: function (val) {
                        return val
                    }
                },
                x: {
                    format: 'dd/MM/yy HH:mm',
                    formatter: function (value) {
                        const date = new Date(value)
                        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
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


    return <>
        <Radio.Group value={selected} onChange={onChange} style={{ marginBottom: 16 }}>
            <Radio.Button value="week">Week</Radio.Button>
            <Radio.Button value="day">Day</Radio.Button>
            <Radio.Button value="hours">Hours</Radio.Button>
        </Radio.Group>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactApexChart options={state.options} series={state.series} height={500} width={1200} type="area" />
        </div>
        <div>
            <TableVUI plusVui={series1} minusVui={series2} categories={categories}></TableVUI>
        </div>
    </>
}