"use client"

import { ConversionResult } from "@/lib/converter"
import { AlertTriangleIcon } from "lucide-react"

interface Props {
    items: ConversionResult[]
}

export default function UnmatchedPanel({ items }: Props) {
    return (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/50 p-4 rounded-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-600 dark:text-amber-500">
                <AlertTriangleIcon className="w-5 h-5" />
                <h4 className="text-sm font-black uppercase tracking-widest">Unmatched Items Detected</h4>
            </div>
            <p className="text-[10px] text-amber-700 dark:text-amber-400 mb-4 font-bold uppercase">
                The following items from the source list could not be mapped to the target brand.
                They will be excluded from the ERP export.
            </p>

            <div className="space-y-2">
                {items.map((res, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-mono bg-white/50 dark:bg-black/20 p-2 rounded-sm border border-amber-200/50">
                        <span className="font-bold">{res.sourceItem.itemCode}</span>
                        <span className="text-muted-foreground">{res.sourceItem.description}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
