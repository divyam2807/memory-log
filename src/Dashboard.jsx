import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { getTodayRange } from "./dateUtils";
import MemoryModal from "./MemoryModal";
import MemoryTimeline from "./MemoryTimeline";

const DAILY_LIMIT = 2;

export default function Dashboard() {
  const [todayMemories, setTodayMemories] = useState([]);
  const [myCountToday, setMyCountToday] = useState(0);
  const [loading, setLoading] = useState(true);

  // modal = null | { mode: "new" | "edit", memory?: {...} }
  const [modal, setModal] = useState(null);

  /* =========================
     LOAD TODAY (single truth)
  ========================= */
  const loadToday = async () => {
    const { start, end } = getTodayRange();

    const q = query(
      collection(db, "memories"),
      where("createdAt", ">=", start),
      where("createdAt", "<=", end),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);

    const list = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setTodayMemories(list);

    setMyCountToday(
      list.filter((m) => m.author === auth.currentUser.email).length
    );

    setLoading(false);
  };

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    const init = async () => {
      await loadToday();
    };
    init();
  }, []);

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (memory) => {
    if (!window.confirm("Delete this memory?")) return;

    await deleteDoc(doc(db, "memories", memory.id));
    await loadToday(); // refresh list + count
  };

  if (loading) return null;

  const canWrite = myCountToday < DAILY_LIMIT;

  return (
    <div>
      {/* HEADER */}
      <h2>Today</h2>
      <p style={{ opacity: 0.7 }}>{new Date().toDateString()}</p>

      {/* WRITE STATUS */}
      <p style={{ marginTop: "14px", opacity: 0.7 }}>
        {myCountToday} of {DAILY_LIMIT} memories written today
      </p>

      {/* WRITE BUTTON */}
      <button
        style={{ marginTop: "18px" }}
        disabled={!canWrite}
        onClick={() => setModal({ mode: "new" })}
      >
        {canWrite ? "Write a memory" : "Enough words for today"}
      </button>

      {/* TODAY TIMELINE */}
      <MemoryTimeline
        memories={todayMemories}
        onEdit={(m) => setModal({ mode: "edit", memory: m })}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {modal && (
        <MemoryModal
          mode={modal.mode}
          memory={modal.memory}
          onClose={(changed) => {
            setModal(null);
            if (changed) loadToday();
          }}
        />
      )}
    </div>
  );
}
