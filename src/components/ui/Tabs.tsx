"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("w-full", className)} {...props} />
)

const TabsList = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("inline-flex h-12 items-center justify-center bg-muted p-1 text-muted-foreground border-b w-full justify-start rounded-t-sm", className)} {...props} />
)

const TabsTrigger = ({
    className,
    active,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) => (
    <button
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap px-6 py-2 text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-widest",
            active
                ? "bg-background text-foreground border-t-2 border-accent"
                : "hover:bg-background/50 hover:text-foreground",
            className
        )}
        {...props}
    />
)

const TabsContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props} />
)

export { Tabs, TabsList, TabsTrigger, TabsContent }
