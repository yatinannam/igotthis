"use client";

import { Card } from "./card";

interface TaskItemProps {
  id: string;
  title: string;
  recurring?: boolean;
  frequency?: string;
  claimedBy?: string;
  completed?: boolean;
  onClaim?: () => void;
  onComplete?: () => void;
}

export function TaskItem({
  title,
  recurring,
  frequency,
  claimedBy,
  completed,
  onClaim,
  onComplete,
}: TaskItemProps) {
  const statusColor = {
    unclaimed: "bg-slate-700/40",
    claimed: "bg-purple-600/20 border-purple-500/30",
    completed: "bg-green-600/20 border-green-500/30",
  };

  let status = "unclaimed";
  if (completed) status = "completed";
  else if (claimedBy) status = "claimed";

  return (
    <Card
      variant="subtle"
      className={`flex items-center gap-3 p-3 ${statusColor[status as keyof typeof statusColor]} border transition-all`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={completed || false}
            onChange={() => onComplete?.()}
            className="w-5 h-5 rounded-full accent-purple-500 cursor-pointer"
          />
          <h3
            className={`font-medium text-sm flex-1 ${
              completed ? "line-through text-slate-500" : "text-white"
            }`}
          >
            {title}
          </h3>
        </div>
        {recurring && (
          <p className="text-xs text-slate-400 mt-1 ml-7">
            {frequency} • Recurring ↻
          </p>
        )}
      </div>
      {!completed && (
        <button
          onClick={() => onClaim?.()}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
            claimedBy
              ? "bg-purple-600/40 text-purple-300 border border-purple-500/30"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          {claimedBy ? "I got this" : "I got this"}
        </button>
      )}
    </Card>
  );
}
