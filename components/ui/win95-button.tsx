"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

const Win95Button = forwardRef<HTMLButtonElement, Win95ButtonProps>(
    ({ children, className, active, style, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`
          relative px-4 py-1.5 
          bg-[#c0c0c0] text-black 
          font-sans select-none
          active:translate-x-[1px] active:translate-y-[1px]
          focus:outline-none 
          ${className ?? ""}
        `}
                style={{
                    boxShadow: active
                        ? "inset 1px 1px 0px 0px #000000, inset -1px -1px 0px 0px #ffffff, inset 2px 2px 0px 0px #808080, inset -2px -2px 0px 0px #dfdfdf"
                        : "inset 1px 1px 0px 0px #ffffff, inset -1px -1px 0px 0px #000000, inset 2px 2px 0px 0px #dfdfdf, inset -2px -2px 0px 0px #808080",
                    fontFamily: `"MS Sans Serif", "Segoe UI", sans-serif`,
                    ...style,
                }}
                {...props}
            >
                <span
                    className="block w-full h-full"
                    style={{
                        transform: active ? "translate(1px, 1px)" : "none",
                    }}
                >
                    {children}
                </span>

                {/* Dotted focus ring approximation */}
                <span className="absolute inset-[4px] border border-dotted border-black opacity-0 group-focus:opacity-100 pointer-events-none" />
            </button>
        );
    }
);

Win95Button.displayName = "Win95Button";

export { Win95Button };
