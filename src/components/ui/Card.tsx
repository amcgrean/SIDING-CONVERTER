import * as React from "react"
import { cn } from "@/lib/utils"

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("rounded-sm border bg-card text-card-foreground shadow-sm industrial-grid", className)} {...props} />
)

const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 p-6 border-b", className)} {...props} />
)

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("text-2xl font-bold leading-none tracking-tight uppercase", className)} {...props} />
)

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("p-6 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
