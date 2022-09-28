import React, { useState, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'

export default function BalanceVUI(props) {
    const [series, setSeries] = useState([0, 0])
    useEffect(() => {
        setSeries([props.using.reduce((total, value) => total + value, 0), props.giving.reduce((total, value) => total + value, 0)])
    }, [props.using, props.giving])

    const state = {
        series,
        options: {
            chart: {
                width: 380,
                type: 'donut',
            },
            plotOptions: {
                pie: {
                    startAngle: -90,
                    endAngle: 270
                }
            },
            labels: ["Using VUI", "Giving VUI"],
            dataLabels: {
                enabled: true
            },
            fill: {
                type: 'gradient',
            },
            legend: {
                formatter: function (val, opts) {
                    if (opts.seriesIndex === 0) {
                        return "Using VUI" + " - " + opts.w.globals.series[opts.seriesIndex]
                    } else {
                        return "Giving VUI" + " - " + opts.w.globals.series[opts.seriesIndex]
                    }

                }
            },
            colors: ['#a0d911', "#ff4d4f"],
            title: {
                text: 'Banlance VUI'
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        },
    };
    return (
        <div>
            <ReactApexChart options={state.options} series={state.series} type="donut" width={380} />
        </div>
    )
}
