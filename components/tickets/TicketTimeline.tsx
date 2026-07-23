import React from "react";
import { Badge } from "@/components/ui/Badge";
import { MessageSquare, ArrowRightLeft, UserCheck, ShieldAlert } from "lucide-react";
import { ActivityType } from "@prisma/client";

export type ActivityItem = {
  id: string;
  type: ActivityType;
  message: string | null;
  createdAt: Date;
  user: {
    name: string;
    role: string;
  };
};

interface TicketTimelineProps {
  activities: ActivityItem[];
}

export function TicketTimeline({ activities }: TicketTimelineProps) {
  if (activities.length === 0) {
    return <p className="text-xs text-slate-500 italic">No activity logged yet.</p>;
  }

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "COMMENT":
        return <MessageSquare className="w-3.5 h-3.5 text-blue-600" />;
      case "STATUS_CHANGE":
        return <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />;
      case "ASSIGNMENT":
        return <UserCheck className="w-3.5 h-3.5 text-indigo-600" />;
      case "PRIORITY_CHANGE":
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center ring-4 ring-white">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1 bg-slate-50/60 p-3 rounded-lg border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{activity.user.name}</span>
                      <Badge type="role" value={activity.user.role} />
                    </div>
                    <time dateTime={activity.createdAt.toString()} className="text-[11px] text-slate-400">
                      {new Date(activity.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  {activity.message && (
                    <div className="text-xs text-slate-700 whitespace-pre-wrap mt-1 font-normal">
                      {activity.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
