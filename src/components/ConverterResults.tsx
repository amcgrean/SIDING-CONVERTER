"use client"

import { ConversionResult } from "@/lib/converter"
import { generateERPCsv, downloadCsv } from "@/lib/csvExport"
import { Button } from "./ui/Button"
import { DownloadIcon, ArrowRightIcon, AlertTriangleIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    results: ConversionResult[]
    jobNumber?: string
    branch?: string
}

export default function ConverterResults({ results, jobNumber, branch }: Props) {
    const handleExport = () => {
        // Now targetItem is always present (even if prefixed with [REVIEW])
        const targetItems = results.map(r => r.targetItem).filter((item): item is any => item !== null)
        const csvContent = generateERPCsv(targetItems, jobNumber, branch)
        const date = new Date().toISOString().split('T')[0]
        const filename = `beisser-converted-${jobNumber || 'estimate'}-${date}.csv`
        downloadCsv(csvContent, filename)
    }

    const unmatchedCount = results.filter(r => !r.isMatched).length

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-primary text-primary-foreground p-3 rounded-t-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-black tracking-tighter uppercase italic">Conversion results</h2>
                    {unmatchedCount > 0 && (
                        <span className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-0.5 text-[9px] font-black uppercase italic">
                            <AlertTriangleIcon className="w-3 h-3" />
                            {unmatchedCount} Unmatched
                        </span>
                    )}
                </div>
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
                            <tr
                                key={idx}
                                className={cn(
                                    "hover:bg-accent/5 transition-colors",
                                    !res.isMatched && "bg-accent/10 italic text-accent-foreground"
                                )}
                            >
                                <td className="p-3 font-bold text-muted-foreground">{res.sourceItem.itemCode}</td>
                                <td className="p-3 font-bold">{res.sourceItem.quantity}</td>
                                <td className="p-3 text-center text-accent">
                                    <ArrowRightIcon className="w-4 h-4 mx-auto" />
                                </td>
                                <td className={cn(
                                    "p-3 font-bold",
                                    res.isMatched ? "text-primary" : "text-accent underline decoration-dotted"
                                )}>
                                    {res.targetItem?.itemCode}
                                </td>
                                <td className="p-3 text-muted-foreground">{res.targetItem?.description}</td>
                                <td className="p-3 text-center">{res.targetItem?.uom}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {unmatchedCount > 0 && (
                <div className="bg-accent/5 border border-accent/20 p-3 rounded-sm flex items-start gap-3">
                    <AlertTriangleIcon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-accent tracking-widest italic">Review Required</p>
                        <p className="text-[11px] text-muted-foreground leading-tight">
                            Items highlighted in amber could not be matched to the target brand.
                            They have been exported with <span className="font-bold">[REVIEW]</span> prefixes for manual lookup in Agility ERP.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
