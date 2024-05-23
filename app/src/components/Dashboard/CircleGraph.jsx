import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);

const CircleGraph = () => {
  let data = [
    {
      label: "Label 1",
      value: 55,
      color: "rgba(0, 43, 73, 1)",
      cutout: "50%",
    },
    {
      label: "Label 2",
      value: 15,
      color: "rgba(0, 103, 160, 1)",
      cutout: "50%",
    },
    {
      label: "Label 3",
      value: 80,
      color: "rgba(83, 217, 217, 1)",
      cutout: "50%",
    },
  ]

  const options = {
    plugins: {
      responsive: true,
    },
    cutout: data.map((item) => item.cutout),
  };

  const finalData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        data: data.map((item) => Math.round(item.value)),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
        dataVisibility: new Array(data.length).fill(true),
      },
    ],
  };

  return <div className="h-96"><Doughnut data={finalData} options={options} /></div>;
}

export default CircleGraph;