import { cn } from "@/lib/utils"

export function Logo({ className = "w-8 h-8", variant = "icon" }: { className?: string, variant?: "icon" | "horizontal" }) {
  const alt = variant === "horizontal" ? "Exomed Therapeutics" : "Exomed Icon"
  return (
    <>
      <img src="/Logo Exomed BG Putih.png" alt={alt} className={cn(className, "block dark:hidden")} />
      <img src="/Logo Exomed BG Hitam.png" alt={alt} className={cn(className, "hidden dark:block")} />
    </>
  )
}