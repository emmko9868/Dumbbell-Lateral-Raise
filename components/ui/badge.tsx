import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary/15 text-primary border border-primary/25",
        secondary:
          "bg-secondary text-secondary-foreground border border-border",
        outline:
          "border border-border text-muted-foreground",
        ghost:
          "text-muted-foreground",
        destructive:
          "bg-destructive/10 text-destructive border border-destructive/20",
        // Domain-specific
        neon:
          "bg-[var(--color-neon-muted)] text-[var(--color-neon)] border border-[var(--color-neon)]/20",
        orange:
          "bg-[var(--color-orange-muted)] text-[var(--color-orange)] border border-[var(--color-orange)]/20",
        yellow:
          "bg-yellow-500/10 text-[var(--color-yellow)] border border-yellow-500/20",
        realtime:
          "bg-muted text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props
    ),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
