import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import GET from "../../utils/GET";

ChartJS.register(ArcElement, Tooltip, Legend);

const CircleGraph = () => {
  const [data, setData] = useState([]);
  let d;

  async function getTrending() {
    try {
      const response = await GET("stats/trending", true);
      if (response && response.trending && Array.isArray(response.trending)) {
        const newData = response.trending.map(e => {
          let randomColor = Math.floor(Math.random() * 16777215).toString(16);
          return {
            label: e.name.includes('(M)') ? e.name.replace('(M)', "") : e.name,
            value: e.nbr,
            color: `#${randomColor}`,
            cutout: "50%",
          };
        });
        setData(newData);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (e) {
      console.error('Error fetching trending data:', e);
    }
  }
  
  useEffect(() => {
    getTrending();
  }, []);

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

  return (
    <div className="w-[600px] h-max-[500px]">
      <Doughnut data={finalData} options={options} />
    </div>
  );
};

export default CircleGraph;
