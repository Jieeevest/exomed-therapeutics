import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/Spinner";

const variants = {
  primary:
    "bg-gold-gradient text-white hover:opacity-90 shadow-[0_0_20px_rgba(78,130,129,0.2)]",
  secondary:
    "bg-white/[0.07] border border-white/[0.15] text-white hover:bg-white/[0.12]",
  ghost:
    "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent",
  destructive:
    "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
  outline: "border border-primary/30 text-primary hover:bg-primary/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-2xl gap-2",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        )}
        {...(props as any)}
      >
        {loading && (
          <Spinner
            size="sm"
            color={variant === "primary" ? "white" : "white"}
          />
        )}
        {children}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
