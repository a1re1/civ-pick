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
  const [sortedLeaders, setSortedLeaders] = useState<[string, number][]>([]);

  useEffect(() => {
    fetchLatestResults();
  }, []);

  useEffect(() => {
    if (latestLeaderResults.length > 0) {
      const leaderScores: Record<string, number> = {};
      
      latestLeaderResults.forEach(result => {
        result.selected_leaders.forEach(leader => {
          leaderScores[leader] = (leaderScores[leader] || 0) + 1;
        });
        result.banned_leaders.forEach(leader => {
          leaderScores[leader] = (leaderScores[leader] || 0) - 1;
        });
      });

      const sortedLeaderScores = Object.entries(leaderScores).sort((a, b) => b[1] - a[1]);
      setSortedLeaders(sortedLeaderScores);
    }
  }, [latestLeaderResults]);

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
            <>
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                  Leader Pick-Ban Rankings
                </h2>
                <ol className="list-decimal list-inside">
                  {sortedLeaders.map(([leader, score]) => (
                    <li key={leader} className="mb-2">
                      {leader}: {score}
                    </li>
                  ))}
                </ol>
              </div>
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
            </>
          )}
        </>
      )}
    </div>
  );
}
