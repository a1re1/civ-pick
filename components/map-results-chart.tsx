"use client"

import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { MapPickBanResult } from "@/db/mapPickBanDAO"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function MapResultsChart({ results }: { results: MapPickBanResult[] }) {
  const mapTypes = ["Pangaea", "Continents", "Islands", "Fractal", "Inland Sea", "Terra"]
  
  const voteCounts = mapTypes.reduce((acc, map) => {
    acc[map] = results.reduce((count, result) => count + (result.selected_maps.includes(map) ? 1 : 0), 0)
    return acc
  }, {} as Record<string, number>)

  const banCounts = mapTypes.reduce((acc, map) => {
    acc[map] = results.reduce((count, result) => count + (result.banned_map === map ? 1 : 0), 0)
    return acc
  }, {} as Record<string, number>)

  const data = {
    labels: mapTypes,
    datasets: [
      {
        label: "Votes",
        data: mapTypes.map(map => voteCounts[map]),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
      {
        label: "Bans",
        data: mapTypes.map(map => banCounts[map]),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgb(255, 99, 132)",
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
