import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export default function Home() {
  const [series1, setSeries1] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 124, 12,
  ]);
  const [series2, setSeries2] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 54, 80,
  ]);
  const [categories, setCategories] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const series = [
    {
      name: "Plus VUI",
      data: series1,
    },
    {
      name: "Minus VUI",
      data: series2,
    },
  ];

  const options = {
    chart: {
      height: 400,
      with: "50%",
      type: "area",
      zoom: {
        autoScaleYaxis: true,
      },
    },
    annotations: {
      yaxis: [
        {
          y: 30,
          borderColor: "#999",
          label: {
            show: true,
            text: "Time",
            style: {
              color: "#fff",
              background: "#00E396",
            },
          },
        },
      ],
      xaxis: [
        {
          borderColor: "#999",
          yAxisIndex: 0,
          label: {
            show: true,
            text: "VUI",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
      ],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#a0d911", "#ff4d4f"],
    xaxis: {
      categories,
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          width: 800,
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  useEffect(() => {
    let a = setInterval(() => {
      let nowTime = new Date();
      setSeries1((prev) => {
        return [...prev.slice(1), randomIntFromInterval(0, 100)];
      });
      setSeries2((prev) => {
        return [...prev.slice(1), randomIntFromInterval(0, 100)];
      });
      setCategories((prev) => {
        return [
          ...prev.slice(1),
          nowTime.getHours() +
            ":" +
            nowTime.getMinutes() +
            ":" +
            nowTime.getSeconds(),
        ];
      });
    }, 1000);

    return () => {
      clearInterval(a);
    };
  }, []);

  // return <ReactApexChart options={options} series={series} type="area" />
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ReactApexChart
        options={options}
        height={600}
        width={1500}
        series={series}
        type="area"
      />
    </div>
  );
}
