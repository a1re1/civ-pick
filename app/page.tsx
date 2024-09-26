"use client"

import { useState } from "react"
import { MapPickBanForm } from "@/components/map-pick-ban-form"
import { MapResultsChart } from "@/components/map-results-chart"
import { Civ6PickBanForm } from "@/components/civ6-pick-ban-form"
import { storeMapPickBanResults } from "@/db/database"

export default function Page() {
  const [mapResults, setMapResults] = useState<{ selectedMaps: string[], bannedMap: string } | null>(null)

  const handleMapFormSubmit = async (data: { selectedMaps: string[], bannedMap: string }) => {
    setMapResults(data)
    try {
      await storeMapPickBanResults(data.selectedMaps, data.bannedMap)
      console.log('Map pick-ban results stored successfully')
    } catch (error) {
      console.error('Failed to store map pick-ban results:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      {!mapResults ? (
        <MapPickBanForm onSubmit={handleMapFormSubmit} />
      ) : (
        <>
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Map Voting Results</h2>
            <MapResultsChart selectedMaps={mapResults.selectedMaps} bannedMap={mapResults.bannedMap} />
          </div>
          <Civ6PickBanForm />
        </>
      )}
    </div>
  )
}
