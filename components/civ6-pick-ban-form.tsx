"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  insertLeaderPickBanResult,
  LeaderPickBanResult,
} from "@/db/leaderPickBanDAO";

const leaders = [
  "Alexander",
  "Amanitore",
  "Ambiorix",
  "Abraham Lincoln",
  "Batrieu",
  "Basil II",
  "Catherine de Medici (Black queed)",
  "Catherine de Medici (Magnificence)",
  "Chandra Gupta Maurya",
  "Cleopatra (Egyptian)",
  "Cleopatra (Ptolemic)",
  "Cyrus",
  "Dido",
  "Eleanor of Aquitaine (France)",
  "Eleanor of Aquitaine (England)",
  "Elizabeth (England)",
  "Frederick Barbarossa",
  "Gandhi",
  "Genghis Khan",
  "Gilgamesh",
  "Gitarja",
  "Gorgo",
  "Hammurabi",
  "Harald Hardrada (Konge)",
  "Harald Hardrada (Varangian)",
  "Hojo Tokimune",
  "Jadwiga",
  "Jayavarman VII",
  "Joao III",
  "John Curtin",
  "Julius Caesar",
  "Kristina",
  "Kublai Khan (China)",
  "Kublai Khan (Mongol)",
  "Kupe",
  "Lady Six Sky",
  "Lautaro",
  "Ludwig II",
  "Mansa Musa",
  "Matthias Corvinus",
  "Menelik II",
  "Montezuma",
  "Mvemba a Nzinga",
  "Nader Shah",
  "Nzinga Mbandi",
  "Pachacuti",
  "Pedro II",
  "Pericles",
  "Peter",
  "Philip II",
  "Poundmaker",
  "Qin Shi Huang (Mandate)",
  "Qin Shi Huang (Unifier)",
  "Ramesses II",
  "Robert the Bruce",
  "Saladin (Vizier)",
  "Saladin (Sultan)",
  "Seondeok",
  "Sejong the Great",
  "Shaka",
  "Simón Bolívar",
  "Suleiman (Kanuni)",
  "Suleiman (Muhtesem)",
  "Sundiatakiata",
  "Tamar",
  "Teddy Roosevelt (Bull Moose)",
  "Teddy Roosevelt (Rough Rider)",
  "Theodora",
  "Tokugawa Ieyasu",
  "Tomyris",
  "Trajan",
  "Victoria (Age of Empire)",
  "Victoria (Age of Steam)",
  "Wilfrid Laurier",
  "Wilhemina",
  "Wu Zetian",
  "Yongle",
];

export function Civ6PickBanForm({
  onSubmit,
}: {
  onSubmit: (result: LeaderPickBanResult) => void;
}) {
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([]);
  const [bannedLeaders, setBannedLeaders] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLeaderToggle = (leader: string, type: "pick" | "ban") => {
    if (type === "pick") {
      setSelectedLeaders((prev) => {
        if (prev.includes(leader)) {
          return prev.filter((l) => l !== leader);
        } else if (prev.length < 10) {
          return [...prev, leader];
        }
        return prev;
      });
      setBannedLeaders((prev) => prev.filter((l) => l !== leader));
    } else {
      setBannedLeaders((prev) => {
        if (prev.includes(leader)) {
          return prev.filter((l) => l !== leader);
        } else if (prev.length < 5) {
          return [...prev, leader];
        }
        return prev;
      });
      setSelectedLeaders((prev) => prev.filter((l) => l !== leader));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await insertLeaderPickBanResult(
        selectedLeaders,
        bannedLeaders
      );
      onSubmit(result);
      // Reset the form after successful submission
      setSelectedLeaders([]);
      setBannedLeaders([]);
    } catch (error) {
      console.error("Failed to store leader pick-ban results:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Civilization VI Leader Selection</CardTitle>
        <CardDescription>Choose leaders to play and ban</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select/Ban Leaders</h3>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <h4 className="font-medium mb-2">Selected Leaders (10 max)</h4>
              <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
                {selectedLeaders.length}/10 selected
              </p>
              <ScrollArea className="h-[300px] w-full border border-neutral-200 rounded-md p-4 dark:border-neutral-800">
                {leaders.map((leader) => (
                  <div
                    key={leader}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`select-${leader}`}
                      checked={selectedLeaders.includes(leader)}
                      onCheckedChange={() => handleLeaderToggle(leader, "pick")}
                      disabled={
                        selectedLeaders.length >= 10 &&
                        !selectedLeaders.includes(leader)
                      }
                    />
                    <label htmlFor={`select-${leader}`}>{leader}</label>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="w-1/2">
              <h4 className="font-medium mb-2">Banned Leaders (5 max)</h4>
              <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
                {bannedLeaders.length}/5 banned
              </p>
              <ScrollArea className="h-[300px] w-full border border-neutral-200 rounded-md p-4 dark:border-neutral-800">
                {leaders.map((leader) => (
                  <div
                    key={leader}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`ban-${leader}`}
                      checked={bannedLeaders.includes(leader)}
                      onCheckedChange={() => handleLeaderToggle(leader, "ban")}
                      disabled={
                        bannedLeaders.length >= 5 &&
                        !bannedLeaders.includes(leader)
                      }
                    />
                    <label htmlFor={`ban-${leader}`}>{leader}</label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={
            selectedLeaders.length === 0 ||
            bannedLeaders.length === 0 ||
            isSubmitting
          }
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
