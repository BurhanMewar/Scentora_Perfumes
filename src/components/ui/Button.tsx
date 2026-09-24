import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: "sm" | "md";
  loading?: boolean;
  loadingText?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-black text-white hover:bg-black/80",
  secondary: "bg-accent text-textPrimary hover:brightness-95",
  outline: "border border-borderRing bg-transparent text-textPrimary hover:bg-cardBg",
  ghost: "bg-transparent text-textPrimary hover:bg-black/5",
};

/** Shared Scentora action button for consistent states and theme styling. */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Loading...",
  startIcon,
  endIcon,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50 ${size === "sm" ? "min-h-9 px-3 py-1.5 text-xs" : "min-h-11 px-5 py-2.5 text-sm"} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />{loadingText}</>
      ) : (
        <>{startIcon}{children}{endIcon}</>
      )}
    </button>
  );
}

export default Button;
