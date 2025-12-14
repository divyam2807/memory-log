import { auth } from "./firebase";
import { USER_NAMES } from "./constants";
const now = Date.now();

export default function MemoryTimeline({ memories, onEdit, onDelete }) {
  if (!memories || memories.length === 0) {
    return (
      <p style={{ opacity: 0.6, marginTop: "40px" }}>
        Nothing written here yet.
      </p>
    );
  }

  return (
    <div className="timeline">
      {memories.map((m, index) => {
        const isMine = m.author === auth.currentUser.email;

        const createdAt = m.createdAt?.toDate();
        const isRecent =
          createdAt && now - createdAt.getTime() < 24 * 60 * 60 * 1000;

        const time = createdAt
          ? createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <div className="timeline-item" key={m.id}>
            {/* ORBIT NUMBER */}
            <div className="timeline-number">{memories.length - index}</div>

            {/* CARD */}
            <div className="timeline-card">
              <p>{m.text}</p>

              {m.imageUrl && (
                <img src={m.imageUrl} alt="memory" className="timeline-image" />
              )}

              <small>
                {USER_NAMES[m.author] || m.author}
                {time && ` · ${time}`}
              </small>

              {/* ACTIONS */}
              {isMine && isRecent && (
                <div style={{ marginTop: "8px" }}>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(m)}
                      style={{ marginRight: "10px" }}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => onDelete(m)}>Delete</button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
