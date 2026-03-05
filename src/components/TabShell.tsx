"use client"

import * as React from "react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { Card } from "@/components/ui/Card"
import CalculatorForm from "@/components/CalculatorForm"
import ConverterInput from "@/components/ConverterInput"

export default function TabShell() {
    const [activeTab, setActiveTab] = useState<"calculator" | "converter">("calculator")

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <header className="mb-8 border-b-4 border-primary pb-4 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black italic">BEISSER LUMBER</h1>
                    <p className="text-sm font-bold text-accent">SIDING ESTIMATOR & CONVERTER // EST. 1855</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs font-mono text-muted-foreground">VERSION: 2.0.0-PROD</p>
                    <p className="text-xs font-mono text-muted-foreground">BUILD: 2026-03-05</p>
                </div>
            </header>

            <Tabs>
                <TabsList>
                    <TabsTrigger
                        active={activeTab === "calculator"}
                        onClick={() => setActiveTab("calculator")}
                    >
                        01. Calculator
                    </TabsTrigger>
                    <TabsTrigger
                        active={activeTab === "converter"}
                        onClick={() => setActiveTab("converter")}
                    >
                        02. Converter
                    </TabsTrigger>
                </TabsList>
                <div className="bg-card border-x border-b p-6 shadow-xl">
                    {activeTab === "calculator" ? (
                        <CalculatorForm />
                    ) : (
                        <ConverterInput />
                    )}
                </div>
            </Tabs>

            <footer className="mt-12 pt-4 border-t border-muted flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <p>© BEISSER LUMBER COMPANY - INTERNAL USE ONLY</p>
                <p>ALL CALCULATIONS INCLUDE STANDARD WASTE FACTORS PER MATERIAL TYPE</p>
            </footer>
        </div>
    )
}
