"use client";

interface FABProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ onClick, label = "+" }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 sm:bottom-8 right-6 w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center text-2xl font-bold z-40"
      aria-label={label}
    >
      {label}
    </button>
  );
}
