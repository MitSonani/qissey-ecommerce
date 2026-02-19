import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({ className, variant = "primary", size = "md", ...props }) {
    const variants = {
        primary: "bg-brand-charcoal text-white hover:bg-black",
        outline: "border border-brand-charcoal text-brand-charcoal hover:bg-brand-charcoal hover:text-white",
        ghost: "bg-transparent hover:bg-brand-gray text-brand-charcoal",
        secondary: "bg-brand-gray text-brand-charcoal hover:bg-brand-charcoal/10"
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-8 py-4 text-sm",
        lg: "px-10 py-5 text-base",
        icon: "p-3"
    };

    return (
        <button
            className={cn(
                "btn-premium inline-flex items-center justify-center uppercase font-bold tracking-widest transition-all",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}

export function Badge({ children, className }) {
    return (
        <span className={cn("px-2 py-0.5 bg-brand-charcoal text-[10px] text-white uppercase font-bold tracking-tighter", className)}>
            {children}
        </span>
    );
}

export function Skeleton({ className }) {
    return <div className={cn("animate-pulse bg-brand-gray", className)} />;
}

export function Spinner({ className, size = 16, color = "currentColor" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
