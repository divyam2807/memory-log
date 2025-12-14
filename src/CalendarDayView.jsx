import MemoryTimeline from "./MemoryTimeline";

export default function CalendarDayView({ date, memories }) {
  if (!date) {
    return (
      <p style={{ opacity: 0.6, marginTop: "30px" }}>
        Select a date to view memories.
      </p>
    );
  }

  if (!memories || memories.length === 0) {
    return (
      <p style={{ opacity: 0.6, marginTop: "30px" }}>
        No memories written on this day.
      </p>
    );
  }

  return (
    <div style={{ marginTop: "40px" }}>
      <h3 style={{ fontWeight: "normal" }}>
        {date.toDateString()}
      </h3>

      <MemoryTimeline memories={memories} />
    </div>
  );
}
