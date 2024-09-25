"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function MapResultsChart({ selectedMaps, bannedMap }: { selectedMaps: string[], bannedMap: string }) {
  const mapTypes = ["Pangaea", "Continents", "Islands", "Fractal", "Inland Sea", "Terra"]
  
  const data = {
    labels: mapTypes,
    datasets: [
      {
        label: "Votes",
        data: mapTypes.map(map => selectedMaps.includes(map) ? 1 : 0),
        backgroundColor: mapTypes.map(map => map === bannedMap ? "rgba(255, 99, 132, 0.5)" : "rgba(75, 192, 192, 0.5)"),
        borderColor: mapTypes.map(map => map === bannedMap ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)"),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Map Type Voting Results",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return <Bar data={data} options={options} />
}
