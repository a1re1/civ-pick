"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for map types and leaders
const mapTypes = ["Pangaea", "Continents", "Islands", "Fractal", "Inland Sea", "Terra"]
const leaders = [
  "Alexander", "Amanitore", "Ambiorix", "Catherine de Medici", "Cleopatra", "Cyrus", 
  "Dido", "Eleanor of Aquitaine", "Frederick Barbarossa", "Gandhi", "Genghis Khan", 
  "Gilgamesh", "Gorgo", "Hammurabi", "Harald Hardrada", "Hojo Tokimune", "Jadwiga", 
  "Jayavarman VII", "John Curtin", "Kristina", "Kupe", "Lady Six Sky", "Lautaro", 
  "Mansa Musa", "Matthias Corvinus", "Montezuma", "Mvemba a Nzinga", "Pachacuti", 
  "Pedro II", "Pericles", "Peter", "Philip II", "Poundmaker", "Qin Shi Huang", 
  "Robert the Bruce", "Saladin", "Seondeok", "Shaka", "Simón Bolívar", "Suleiman", 
  "Tamar", "Teddy Roosevelt", "Tomyris", "Trajan", "Victoria", "Wilfrid Laurier"
]

export function Civ6PickBanForm() {
  const [step, setStep] = useState(1)
  const [selectedMaps, setSelectedMaps] = useState<string[]>([])
  const [bannedMap, setBannedMap] = useState<string>("")
  const [selectedLeaders, setSelectedLeaders] = useState<string[]>([])
  const [bannedLeaders, setBannedLeaders] = useState<string[]>([])

  const handleMapToggle = (map: string) => {
    setSelectedMaps(prev => {
      if (prev.includes(map)) {
        return prev.filter(m => m !== map)
      } else if (prev.length < 3) {
        return [...prev, map]
      }
      return prev
    })
  }

  const handleLeaderToggle = (leader: string, type: "pick" | "ban") => {
    if (type === "pick") {
      setSelectedLeaders(prev => {
        if (prev.includes(leader)) {
          return prev.filter(l => l !== leader)
        } else if (prev.length < 10) {
          return [...prev, leader]
        }
        return prev
      })
      setBannedLeaders(prev => prev.filter(l => l !== leader))
    } else {
      setBannedLeaders(prev => {
        if (prev.includes(leader)) {
          return prev.filter(l => l !== leader)
        } else if (prev.length < 5) {
          return [...prev, leader]
        }
        return prev
      })
      setSelectedLeaders(prev => prev.filter(l => l !== leader))
    }
  }

  const handleSubmit = () => {
    console.log("Submitted:", { selectedMaps, bannedMap, selectedLeaders, bannedLeaders })
    // Here you would typically send this data to a server
    alert("Form submitted! Check console for details.")
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Civilization VI Pick/Ban Form</CardTitle>
        <CardDescription>Select map types and choose leaders for your game</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Vote for Map Types</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Select up to 3 map types</p>
            <div className="grid grid-cols-2 gap-4">
              {mapTypes.map((map) => (
                <div key={map} className="flex items-center space-x-2">
                  <Checkbox
                    id={`map-${map}`}
                    checked={selectedMaps.includes(map)}
                    onCheckedChange={() => handleMapToggle(map)}
                    disabled={selectedMaps.length >= 3 && !selectedMaps.includes(map)}
                  />
                  <Label htmlFor={`map-${map}`}>{map}</Label>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Label htmlFor="banned-map">Ban a Map Type</Label>
              <Select value={bannedMap} onValueChange={setBannedMap}>
                <SelectTrigger id="banned-map" className="w-full">
                  <SelectValue placeholder="Select a map to ban" />
                </SelectTrigger>
                <SelectContent>
                  {mapTypes.map((map) => (
                    <SelectItem key={map} value={map}>
                      {map}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Select/Ban Leaders</h3>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h4 className="font-medium mb-2">Selected Leaders (10 max)</h4>
                <p className="text-sm text-neutral-500 mb-2 dark:text-neutral-400">
                  {selectedLeaders.length}/10 selected
                </p>
                <ScrollArea className="h-[300px] w-full border border-neutral-200 rounded-md p-4 dark:border-neutral-800">
                  {leaders.map((leader) => (
                    <div key={leader} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`select-${leader}`}
                        checked={selectedLeaders.includes(leader)}
                        onCheckedChange={() => handleLeaderToggle(leader, "pick")}
                        disabled={selectedLeaders.length >= 10 && !selectedLeaders.includes(leader)}
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
                    <div key={leader} className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id={`ban-${leader}`}
                        checked={bannedLeaders.includes(leader)}
                        onCheckedChange={() => handleLeaderToggle(leader, "ban")}
                        disabled={bannedLeaders.length >= 5 && !bannedLeaders.includes(leader)}
                      />
                      <label htmlFor={`ban-${leader}`}>{leader}</label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Previous
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={() => setStep(step + 1)} disabled={selectedMaps.length === 0}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedLeaders.length === 0 || bannedLeaders.length === 0}
          >
            Submit
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}