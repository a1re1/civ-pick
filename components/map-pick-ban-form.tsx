"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { insertMapPickBanResult, MapPickBanResult } from "@/db/mapPickBanDAO"

const mapTypes = ["Pangaea", "Continents", "Islands", "Fractal", "Inland Sea", "Terra"]

export function MapPickBanForm({ onSubmit }: { onSubmit: (result: MapPickBanResult) => void }) {
  const [selectedMaps, setSelectedMaps] = useState<string[]>([])
  const [bannedMap, setBannedMap] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await insertMapPickBanResult(selectedMaps, bannedMap)
      onSubmit(result)
    } catch (error) {
      console.error('Failed to store map pick-ban results:', error)
      // You might want to show an error message to the user here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Map Type Selection</CardTitle>
        <CardDescription>Vote for map types and ban one</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vote for Map Types</h3>
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={selectedMaps.length === 0 || !bannedMap}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  )
}
