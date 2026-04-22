import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_25px_rgba(37,99,235,0.28)] transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}