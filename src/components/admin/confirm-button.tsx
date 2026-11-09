"use client";

export function DangerButton({ children, confirm: message = "Tem certeza? Esta ação não pode ser desfeita." }: { children: React.ReactNode; confirm?: string }) {
  return (
    <button
      type="submit"
      className="text-sm font-medium text-[#9b2c35] underline underline-offset-2"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
