"use client";

interface ProgressEntry {
  date: string;
  cardsStudied: number;
}

interface CalendarHeatmapProps {
  entries: ProgressEntry[];
}

export default function CalendarHeatmap({ entries }: CalendarHeatmapProps) {
  const weeks = 12;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const entryMap = new Map<string, number>();
  for (const e of entries) {
    const d = new Date(e.date);
    d.setHours(0, 0, 0, 0);
    entryMap.set(d.toISOString().split("T")[0], e.cardsStudied);
  }

  const maxCards = Math.max(...Array.from(entryMap.values()), 1);

  const getColor = (count: number) => {
    if (count === 0) return "#F0E8D8";
    const intensity = count / maxCards;
    if (intensity < 0.25) return "#f5d0d7";
    if (intensity < 0.5) return "#d9758a";
    if (intensity < 0.75) return "#c41e3a";
    return "#A51C30";
  };

  // Build grid: weeks columns, 7 rows (Sun–Sat)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeks * 7 + 1);

  const days: Array<{ date: Date; count: number }> = [];
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().split("T")[0];
    days.push({ date: d, count: entryMap.get(key) ?? 0 });
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          <div className="w-6 h-4" /> {/* header spacer */}
          {dayLabels.map((d, i) => (
            <div key={i} className="h-4 w-6 text-[9px] text-muted flex items-center">
              {i % 2 === 0 ? d.slice(0, 1) : ""}
            </div>
          ))}
        </div>

        {/* Columns */}
        {Array.from({ length: weeks }).map((_, wi) => {
          const weekDays = days.slice(wi * 7, wi * 7 + 7);
          const firstDay = weekDays[0]?.date;
          const monthLabel = firstDay
            ? firstDay.toLocaleDateString("en-US", { month: "short" })
            : "";
          const showMonth = wi === 0 || firstDay?.getDate() <= 7;

          return (
            <div key={wi} className="flex flex-col gap-1">
              <div className="h-4 text-[9px] text-muted text-center">
                {showMonth ? monthLabel : ""}
              </div>
              {weekDays.map((day, di) => {
                const isFuture = day.date > today;
                return (
                  <div
                    key={di}
                    title={`${day.date.toLocaleDateString()}: ${day.count} cards`}
                    className="w-4 h-4 rounded-sm transition-opacity"
                    style={{
                      backgroundColor: isFuture ? "#F5EFE0" : getColor(day.count),
                      opacity: isFuture ? 0.3 : 1,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 text-xs text-muted">
        <span>Less</span>
        {["#F0E8D8", "#f5d0d7", "#d9758a", "#c41e3a", "#A51C30"].map((c) => (
          <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
