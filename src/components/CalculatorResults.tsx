"use client"

import { CalculationResult } from "@/lib/calculator"
import { generateERPCsv, downloadCsv } from "@/lib/csvExport"
import { Button } from "./ui/Button"
import { DownloadIcon } from "lucide-react"

interface Props {
    results: CalculationResult[]
    jobNumber?: string
    branch?: string
}

export default function CalculatorResults({ results, jobNumber, branch }: Props) {
    const handleExport = () => {
        const csvContent = generateERPCsv(results, jobNumber, branch)
        const date = new Date().toISOString().split('T')[0]
        const filename = `beisser-siding-${jobNumber || 'estimate'}-${date}.csv`
        downloadCsv(csvContent, filename)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-primary text-primary-foreground p-3 rounded-t-sm">
                <h2 className="text-lg font-black tracking-tighter uppercase italic">Bill of Materials</h2>
                <Button
                    variant="accent"
                    size="sm"
                    onClick={handleExport}
                    className="h-8 text-[10px]"
                    disabled={results.length === 0}
                >
                    <DownloadIcon className="w-3 h-3 mr-2" />
                    Export to ERP (.CSV)
                </Button>
            </div>

            <div className="border overflow-hidden rounded-b-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted text-muted-foreground text-[10px] font-mono uppercase tracking-widest border-b">
                            <th className="p-3 font-medium">SKU / Item Code</th>
                            <th className="p-3 font-medium">Description</th>
                            <th className="p-3 font-medium text-right">Qty</th>
                            <th className="p-3 font-medium text-center">UOM</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y font-mono text-xs">
                        {results.length > 0 ? (
                            results.map((item, idx) => (
                                <tr key={idx} className="hover:bg-accent/5 transition-colors">
                                    <td className="p-3 font-bold">{item.itemCode}</td>
                                    <td className="p-3 text-muted-foreground">{item.description}</td>
                                    <td className="p-3 text-right font-black text-primary">{item.quantity}</td>
                                    <td className="p-3 text-center">{item.uom}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-muted-foreground italic">
                                    Enter dimensions to generate material list
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-accent/10 border border-accent/20 p-4 rounded-sm">
                <p className="text-[10px] font-bold text-accent uppercase tracking-widest">
                    ESTIMATOR NOTE: All rounded values include 12% standard waste for Hardie/LP and 5% for Vinyl.
                </p>
            </div>
        </div>
    )
}
