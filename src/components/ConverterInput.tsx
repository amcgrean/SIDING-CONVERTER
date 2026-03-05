"use client"

import { useState } from "react"
import { SidingType } from "@/lib/sidingData"
import { parseInputCsv } from "@/lib/csvParser"
import { detectSidingType, convertMaterialList, ConversionResult } from "@/lib/converter"
import { Button } from "./ui/Button"
import { Label } from "./ui/Label"
import { Select } from "./ui/Select"
import { Input } from "./ui/Input"
import { Card } from "./ui/Card"
import { UploadIcon, FileTextIcon, ArrowRightIcon } from "lucide-react"
import ConverterResults from "@/components/ConverterResults"
import UnmatchedPanel from "@/components/UnmatchedPanel"

export default function ConverterInput() {
    const [csvText, setCsvText] = useState("")
    const [sourceType, setSourceType] = useState<SidingType | "auto">("auto")
    const [targetType, setTargetType] = useState<SidingType>("Hardie")
    const [results, setResults] = useState<ConversionResult[]>([])
    const [jobNumber, setJobNumber] = useState("")
    const [branch, setBranch] = useState("")

    const handleConvert = () => {
        const items = parseInputCsv(csvText)
        const detected = sourceType === "auto" ? (detectSidingType(items.map(i => i.itemCode)) || "LP") : sourceType
        const converted = convertMaterialList(items, targetType)
        setResults(converted)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target?.result as string
            setCsvText(text)
        }
        reader.readAsText(file)
    }

    const unmatched = results.filter(r => !r.isMatched)
    const matched = results.filter(r => r.isMatched)

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>PASTE CSV DATA OR UPLOAD</Label>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-7 text-[10px] relative">
                                <UploadIcon className="w-3 h-3 mr-2" />
                                Upload CSV
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                />
                            </Button>
                        </div>
                    </div>
                    <textarea
                        className="w-full h-64 p-4 font-mono text-xs bg-muted/20 border rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                        placeholder="ItemCode,Description,Quantity,UOM..."
                        value={csvText}
                        onChange={(e) => setCsvText(e.target.value)}
                    />
                </div>

                <div className="space-y-6">
                    <Card className="p-6 border-dashed">
                        <h3 className="text-sm font-black mb-4 flex items-center gap-2">
                            <FileTextIcon className="w-4 h-4 text-accent" />
                            CONVERSION PARAMETERS
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Source Brand</Label>
                                    <Select
                                        value={sourceType}
                                        onChange={(e) => setSourceType(e.target.value as any)}
                                    >
                                        <option value="auto">Auto-Detect</option>
                                        <option value="LP">LP SmartSide</option>
                                        <option value="Hardie">James Hardie</option>
                                        <option value="Vinyl">Vinyl Siding</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Target Brand</Label>
                                    <Select
                                        value={targetType}
                                        onChange={(e) => setTargetType(e.target.value as SidingType)}
                                    >
                                        <option value="LP">LP SmartSide</option>
                                        <option value="Hardie">James Hardie</option>
                                        <option value="Vinyl">Vinyl Siding</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                <div className="space-y-2">
                                    <Label>Job Number</Label>
                                    <Input
                                        placeholder="OPTIONAL"
                                        value={jobNumber}
                                        onChange={(e) => setJobNumber(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Branch</Label>
                                    <Input
                                        placeholder="OPTIONAL"
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                variant="accent"
                                className="w-full mt-4 h-12 text-lg"
                                onClick={handleConvert}
                                disabled={!csvText.trim()}
                            >
                                Start Conversion
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </Card>

                    {unmatched.length > 0 && <UnmatchedPanel items={unmatched} />}
                </div>
            </div>

            {results.length > 0 && (
                <ConverterResults
                    results={matched}
                    jobNumber={jobNumber}
                    branch={branch}
                />
            )}
        </div>
    )
}
