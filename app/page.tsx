"use client";

import { useState, useEffect } from "react";
import { MapPickBanForm } from "@/components/map-pick-ban-form";
import { MapResultsChart } from "@/components/map-results-chart";
import { Civ6PickBanForm } from "@/components/civ6-pick-ban-form";
import {
  getLatestMapPickBanResults,
  MapPickBanResult,
} from "@/db/mapPickBanDAO";
import {
  getLatestLeaderPickBanResults,
  LeaderPickBanResult,
} from "@/db/leaderPickBanDAO";

export default function Page() {
  const [latestMapResults, setLatestMapResults] = useState<MapPickBanResult[]>([]);
  const [latestLeaderResults, setLatestLeaderResults] = useState<LeaderPickBanResult[]>([]);

  useEffect(() => {
    fetchLatestResults();
  }, []);

  const fetchLatestResults = async () => {
    try {
      const mapResults = await getLatestMapPickBanResults();
      setLatestMapResults(mapResults);
      const leaderResults = await getLatestLeaderPickBanResults();
      setLatestLeaderResults(leaderResults);
    } catch (error) {
      console.error("Failed to fetch latest results:", error);
    }
  };

  const handleMapFormSubmit = () => {
    console.log("Map pick-ban results stored successfully");
    fetchLatestResults();
  };

  const handleLeaderFormSubmit = (result: LeaderPickBanResult) => {
    console.log("Leader pick-ban results stored successfully:", result);
    fetchLatestResults();
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <MapPickBanForm onSubmit={handleMapFormSubmit} />
      {latestMapResults.length > 0 && (
        <>
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Map Voting Results</h2>
            <MapResultsChart results={latestMapResults} />
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              Previous Map Voting Results
            </h2>
            {latestMapResults.slice(1).map((result, index) => (
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
          <Civ6PickBanForm onSubmit={handleLeaderFormSubmit} />
          {latestLeaderResults.length > 0 && (
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                Previous Leader Pick-Ban Results
              </h2>
              {latestLeaderResults.map((result, index) => (
                <div key={result.id} className="mb-4 p-4 border rounded">
                  <h3 className="text-lg font-semibold">Result {index + 1}</h3>
                  <p>Selected Leaders: {result.selected_leaders.join(", ")}</p>
                  <p>Banned Leaders: {result.banned_leaders.join(", ")}</p>
                  <p>
                    Created At: {new Date(result.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
