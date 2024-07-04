import React, { useRef, useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import GET from "../../utils/GET";

const months = [
  {
    nbr: 1,
    month: "Jan",
  },
  {
    nbr: 2,
    month: "Fév",
  },
  {
    nbr: 3,
    month: "Mar",
  },
  {
    nbr: 4,
    month: "Avr",
  },
  {
    nbr: 5,
    month: "Mai",
  },
  {
    nbr: 6,
    month: "Juin",
  },
  {
    nbr: 7,
    month: "Juil",
  },
  {
    nbr: 8,
    month: "Aoû",
  },
  {
    nbr: 9,
    month: "Sep",
  },
  {
    nbr: 10,
    month: "Oct",
  },
  {
    nbr: 11,
    month: "Nov",
  },
  {
    nbr: 12,
    month: "Déc",
  },
];

const valueFormatter = (value) =>
  `${value} ${value > 1 ? "Produits" : "Produit"}`;

export default function BarGraph() {
  const [data, setData] = useState([]);
  const chartContainerRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({
    width: 700,
    height: 500,
  });

  async function getTrending() {
    try {
      const response = await GET("stats/productsStats", true);
      if (response && response.data && Array.isArray(response.data)) {
        const DATA = response.data;

        // Create an object to store product names
        const productNames = DATA.reduce((acc, item) => {
          acc[item.name] = true;
          return acc;
        }, {});

        // Create the new data structure
        const newData = months.map((m) => {
          const monthData = {
            month: m.month,
          };

          // Initialize all products with 0 for each month
          Object.keys(productNames).forEach((name) => {
            monthData[name] = 0;
          });

          // Update values for products that have data for this month
          DATA.forEach((item) => {
            if (item.created_month === m.nbr.toString()) {
              monthData[item.name] = item.product_total;
            }
          });

          return monthData;
        });

        setData(newData);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (e) {
      console.error("Error fetching trending data:", e);
    }
  }

  useEffect(() => {
    getTrending();
  }, []);

  const chartSetting = {
    yAxis: [
      {
        label: "Client files creation timeline",
      },
    ],
    width: chartDimensions.width,
    height: chartDimensions.height,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(-20px, 0)",
      },
    },
  };
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const { width } = chartContainerRef.current.getBoundingClientRect();
        setChartDimensions({
          width: width,
          height: width * 0.6, // Maintain a 5:3 aspect ratio, adjust as needed
        });
      }
    };

    updateDimensions(); // Initial measurement
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "auto" }}>
      <BarChart
        dataset={data}
        xAxis={[{ scaleType: "band", dataKey: "month" }]}
        series={Object.keys(data[0] || {})
          .filter((key) => key !== "month")
          .map((productName) => ({
            dataKey: productName,
            label: productName.includes("(M)")
              ? productName.replace("(M)", "")
              : productName,
            valueFormatter,
          }))}
        {...chartSetting}
      />
    </div>
  );
}
