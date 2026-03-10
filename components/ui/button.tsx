"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/70 active:scale-[0.98]",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted active:scale-[0.98]",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground active:scale-[0.98]",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/25 active:scale-[0.98]",
        link:
          "text-primary underline-offset-4 hover:underline",
        // Exercise/camera legacy
        fire: "mc-btn-orange",
        slate: "mc-btn",
        green: "mc-btn-green",
      },
      size: {
        default: "h-9 px-4",
        sm:      "h-8 px-3 text-xs",
        lg:      "h-11 px-6 text-base",
        xl:      "h-14 px-6 text-lg",
        icon:    "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
