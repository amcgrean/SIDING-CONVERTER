"use client"

import { useState, useEffect } from "react"
import { SidingType } from "@/lib/sidingData"
import { CalculatorInputs, calculateMaterials, CalculationResult } from "@/lib/calculator"
import { Label } from "./ui/Label"
import { Input } from "./ui/Input"
import { Select } from "./ui/Select"
import { Switch } from "./ui/Switch"
import { Button } from "./ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/Card"
import CalculatorResults from "@/components/CalculatorResults"

export default function CalculatorForm() {
    const [inputs, setInputs] = useState<CalculatorInputs>({
        sidingType: "LP",
        width: 24,
        length: 36,
        wallHeight: 8,
        roofSlope: 4,
        roofOverhang: 12,
        overheadDoors: 1,
        serviceDoors: 1,
        windows: 2,
        wrapWindows: false,
        jobNumber: "",
        branch: ""
    })

    const [results, setResults] = useState<CalculationResult[]>([])

    useEffect(() => {
        const res = calculateMaterials(inputs)
        setResults(res)
    }, [inputs])

    const handleChange = (name: keyof CalculatorInputs, value: any) => {
        setInputs(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sidingType">Siding Type</Label>
                        <Select
                            id="sidingType"
                            value={inputs.sidingType}
                            onChange={(e) => handleChange("sidingType", e.target.value as SidingType)}
                        >
                            <option value="LP">LP SmartSide</option>
                            <option value="Hardie">James Hardie</option>
                            <option value="Vinyl">Vinyl Siding</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="roofSlope">Roof Slope</Label>
                        <Select
                            id="roofSlope"
                            value={inputs.roofSlope}
                            onChange={(e) => handleChange("roofSlope", parseInt(e.target.value))}
                        >
                            {[4, 5, 6, 7, 8].map(v => (
                                <option key={v} value={v}>{v}:12</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (FT)</Label>
                        <Input
                            id="width"
                            type="number"
                            value={inputs.width}
                            onChange={(e) => handleChange("width", parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="length">Length (FT)</Label>
                        <Input
                            id="length"
                            type="number"
                            value={inputs.length}
                            onChange={(e) => handleChange("length", parseFloat(e.target.value))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wallHeight">Wall Height (FT)</Label>
                        <Input
                            id="wallHeight"
                            type="number"
                            value={inputs.wallHeight}
                            onChange={(e) => handleChange("wallHeight", parseFloat(e.target.value))}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="roofOverhang">Overhang (IN)</Label>
                        <Select
                            id="roofOverhang"
                            value={inputs.roofOverhang}
                            onChange={(e) => handleChange("roofOverhang", parseInt(e.target.value))}
                        >
                            <option value={12}>12"</option>
                            <option value={16}>16"</option>
                            <option value={24}>24"</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="overheadDoors">OH Doors</Label>
                        <Select
                            id="overheadDoors"
                            value={inputs.overheadDoors}
                            onChange={(e) => handleChange("overheadDoors", parseInt(e.target.value))}
                        >
                            {[0, 1, 2, 3, 4].map(v => <option key={v} value={v}>{v}</option>)}
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="serviceDoors">Service Doors</Label>
                        <Select
                            id="serviceDoors"
                            value={inputs.serviceDoors}
                            onChange={(e) => handleChange("serviceDoors", parseInt(e.target.value))}
                        >
                            {[0, 1, 2].map(v => <option key={v} value={v}>{v}</option>)}
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-8 bg-muted/30 p-4 border border-dashed rounded-sm">
                    <div className="space-y-2 flex-1">
                        <Label htmlFor="windows">Number of Windows</Label>
                        <Select
                            id="windows"
                            value={inputs.windows}
                            onChange={(e) => handleChange("windows", parseInt(e.target.value))}
                        >
                            {[0, 1, 2, 3, 4, 5, 6].map(v => <option key={v} value={v}>{v}</option>)}
                        </Select>
                    </div>
                    {inputs.windows > 0 && (
                        <div className="flex flex-col items-center gap-2">
                            <Label>Wrap Windows?</Label>
                            <Switch
                                checked={inputs.wrapWindows}
                                onChange={(e) => handleChange("wrapWindows", (e.target as HTMLInputElement).checked)}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="jobNumber">Job Number</Label>
                        <Input
                            id="jobNumber"
                            placeholder="OPTIONAL"
                            value={inputs.jobNumber}
                            onChange={(e) => handleChange("jobNumber", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="branch">Branch</Label>
                        <Input
                            id="branch"
                            placeholder="OPTIONAL"
                            value={inputs.branch}
                            onChange={(e) => handleChange("branch", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-7">
                <CalculatorResults
                    results={results}
                    jobNumber={inputs.jobNumber}
                    branch={inputs.branch}
                />
            </div>
        </div>
    )
}
