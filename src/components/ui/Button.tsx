import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'accent'
    size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        const variants = {
            primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
            ghost: 'hover:bg-accent hover:text-accent-foreground',
            accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
        }

        const sizes = {
            default: 'h-10 px-4 py-2',
            sm: 'h-8 px-3 text-xs',
            lg: 'h-12 px-8',
            icon: 'h-9 w-9',
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
