import React, { useEffect, useState, useRef } from 'react';
import ReactApexChart from "react-apexcharts"
import { getAccessToken } from '../../../helper/Cookies';
import TableVUI from './TableVUI';
import socketIOClient from 'socket.io-client';
import { Col, Row } from 'antd';
import BalanceVUI from './BalanceVUI';
import URL from "../../../api/config"
import { get } from "../../../api/axios"
const host = 'http://localhost:5050'

export default function Chart() {
    const socketRef = useRef()
    useEffect(() => {
        // Connect socket
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.on('connect', function () {
            socketRef.current.emit('authenticate', { token: getAccessToken() });
        });
        socketRef.current.on('getData', (data) => {
            console.log("S")
            setSeries1(prev => {
                return [...prev.slice(0), data.using];
            })
            setSeries2(prev => {
                return [...prev.slice(0), data.giving];
            })
            setCategories(prev => {
                return [...prev.slice(0), data.date]
            })
        })

        // 
        return () => {
            socketRef.current.disconnect()
        }
    }, [])

    useEffect(() => {
        const getAllData = () => {
            get(URL.URL_GET_ALL_DATA)
                .then(res => {
                    setCategories(res.data.arrCate)
                    setSeries2(res.data.Giving)
                    setSeries1(res.data.Using)
                })
                .catch(err => {
                    alert(err.message)
                })
        }
        getAllData()
    }, [])


    const [series1, setSeries1] = useState([])
    const [series2, setSeries2] = useState([])
    const [categories, setCategories] = useState([])
    const series = [
        {
            name: 'Using VUI',
            data: series1,
        }, {
            name: 'Giving VUI',
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
        <div style={{ display: "flex", justifyContent: "center" }}>
            <ReactApexChart options={state.options} series={state.series} height={500} width={1200} type="area" />
        </div>
        <Row className='mt-3' gutter={[16, 16]}>
            <Col xl={12} md={24}>
                <TableVUI using={series1} giving={series2} categories={categories}></TableVUI>
            </Col>
            <Col xl={12} md={24}>
                <BalanceVUI using={series1} giving={series2} ></BalanceVUI>
            </Col>
        </Row>
    </>
}