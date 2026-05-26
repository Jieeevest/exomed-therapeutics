export function Logo({ className = "w-8 h-8", variant = "icon" }: { className?: string, variant?: "icon" | "horizontal" }) {
  if (variant === "horizontal") {
    return (
      <img 
        src="/LOGO ORIGINAL FULL HORIZONTAL TRANSPARENT.png" 
        alt="CryptoEx Logo" 
        className={className} 
      />
    )
  }

  return (
    <img 
      src="/LOGO3.png" 
      alt="CryptoEx Icon" 
      className={className} 
    />
  )
}