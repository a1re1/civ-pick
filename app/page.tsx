"use client";

import { useState, useEffect } from "react";
import { MapPickBanForm } from "@/components/map-pick-ban-form";
import { MapResultsChart } from "@/components/map-results-chart";
import { Civ6PickBanForm } from "@/components/civ6-pick-ban-form";
import {
  getLatestMapPickBanResults,
  MapPickBanResult,
} from "@/db/mapPickBanDAO";

export default function Page() {
  const [mapResults, setMapResults] = useState<MapPickBanResult | null>(null);
  const [latestResults, setLatestResults] = useState<MapPickBanResult[]>([]);

  useEffect(() => {
    fetchLatestResults();
  }, []);

  const fetchLatestResults = async () => {
    try {
      const results = await getLatestMapPickBanResults();
      setLatestResults(results);
    } catch (error) {
      console.error("Failed to fetch latest results:", error);
    }
  };

  const handleMapFormSubmit = (result: MapPickBanResult) => {
    setMapResults(result);
    console.log("Map pick-ban results stored successfully");
    fetchLatestResults();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <MapPickBanForm onSubmit={handleMapFormSubmit} />
      {latestResults.length > 0 && (
        <>
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Latest Map Voting Results</h2>
            <MapResultsChart
              selectedMaps={latestResults[0].selected_maps}
              bannedMap={latestResults[0].banned_map}
            />
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Previous Map Voting Results
            </h2>
            {latestResults.slice(1).map((result, index) => (
              <div key={result.id} className="mb-4 p-4 border rounded">
                <h3 className="text-lg font-semibold">Result {index + 2}</h3>
                <p>Selected Maps: {result.selected_maps.join(", ")}</p>
                <p>Banned Map: {result.banned_map}</p>
                <p>
                  Created At: {new Date(result.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Civ6PickBanForm />
        </>
      )}
    </div>
  );
}
