import "./CalendarGrid.css";

export default function CalendarGrid({
  year,
  month,
  datesWithMemories,
  onSelect,
}) {
  return (
    <div className="calendar-grid">
      <h3 style={{ marginBottom: "12px" }}>
        {new Date(year, month).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h3>

      <div className="calendar-days">
        {datesWithMemories.map((d) => {
          const key = d.date.toISOString().slice(0, 10);

          return (
            <button
              key={key}
              className={`
    calendar-day
    ${d.hasMemories ? "has-memory" : "no-memory"}
    ${d.isToday ? "today" : ""}
    ${d.disabled ? "disabled" : ""}
  `}
              disabled={d.disabled}
              onClick={() => onSelect(d.date)}
            >
              {d.date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
