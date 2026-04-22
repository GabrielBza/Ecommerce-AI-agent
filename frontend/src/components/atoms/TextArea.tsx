import type { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className="min-h-[44px] max-h-32 flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-blue-500"
    />
  );
}