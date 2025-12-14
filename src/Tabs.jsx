export default function Tabs({ active, onChange }) {
  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
      <button
        onClick={() => onChange("dashboard")}
        style={{
          opacity: active === "dashboard" ? 1 : 0.5,
        }}
      >
        Dashboard
      </button>

      <button
        onClick={() => onChange("calendar")}
        style={{
          opacity: active === "calendar" ? 1 : 0.5,
        }}
      >
        Calendar
      </button>
    </div>
  );
}
