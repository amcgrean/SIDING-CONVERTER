"use client"

import { ConversionResult } from "@/lib/converter"
import { generateERPCsv, downloadCsv } from "@/lib/csvExport"
import { Button } from "./ui/Button"
import { DownloadIcon, ArrowRightIcon } from "lucide-react"

interface Props {
    results: ConversionResult[]
    jobNumber?: string
    branch?: string
}

export default function ConverterResults({ results, jobNumber, branch }: Props) {
    const handleExport = () => {
        const targetItems = results.map(r => r.targetItem).filter((item): item is any => item !== null)
        const csvContent = generateERPCsv(targetItems, jobNumber, branch)
        const date = new Date().toISOString().split('T')[0]
        const filename = `beisser-converted-${jobNumber || 'estimate'}-${date}.csv`
        downloadCsv(csvContent, filename)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-primary text-primary-foreground p-3 rounded-t-sm">
                <h2 className="text-lg font-black tracking-tighter uppercase italic">Conversion results</h2>
                <Button
                    variant="accent"
                    size="sm"
                    onClick={handleExport}
                    className="h-8 text-[10px]"
                    disabled={results.length === 0}
                >
                    <DownloadIcon className="w-3 h-3 mr-2" />
                    Export Converted List (.CSV)
                </Button>
            </div>

            <div className="border overflow-hidden rounded-b-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted text-muted-foreground text-[10px] font-mono uppercase tracking-widest border-b">
                            <th className="p-3 font-medium">Source SKU</th>
                            <th className="p-3 font-medium">Qty</th>
                            <th className="p-3 font-medium text-center">→</th>
                            <th className="p-3 font-medium">Target SKU</th>
                            <th className="p-3 font-medium">Target Description</th>
                            <th className="p-3 font-medium text-center">UOM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y font-mono text-xs">
                        {results.map((res, idx) => (
                            <tr key={idx} className="hover:bg-accent/5 transition-colors">
                                <td className="p-3 font-bold text-muted-foreground">{res.sourceItem.itemCode}</td>
                                <td className="p-3 font-bold">{res.sourceItem.quantity}</td>
                                <td className="p-3 text-center text-accent">
                                    <ArrowRightIcon className="w-4 h-4 mx-auto" />
                                </td>
                                <td className="p-3 font-bold text-primary">{res.targetItem?.itemCode}</td>
                                <td className="p-3 text-muted-foreground">{res.targetItem?.description}</td>
                                <td className="p-3 text-center">{res.targetItem?.uom}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
