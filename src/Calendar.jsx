import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import CalendarGrid from "./CalendarGrid";
import CalendarDayView from "./CalendarDayView";
import { getMonthDays } from "./calendarUtils";

export default function Calendar() {
  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [datesWithMemories, setDatesWithMemories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const loadMonth = async () => {
      const snap = await getDocs(collection(db, "memories"));

      const map = {};
      snap.docs.forEach((d) => {
        const date = d
          .data()
          .createdAt?.toDate()
          .toISOString()
          .slice(0, 10);
        map[date] = true;
      });

      const days = getMonthDays(year, month).map((d) => {
        const key = d.toISOString().slice(0, 10);
        const isFuture = d > today;

        return {
          date: d,
          hasMemories: !!map[key],
          disabled: isFuture,
          isToday:
            key === today.toISOString().slice(0, 10),
        };
      });

      setDatesWithMemories(days);
    };

    loadMonth();
  }, [year, month]);

  const loadDate = async (date) => {
    if (date > today) return;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const snap = await getDocs(collection(db, "memories"));

    const list = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((m) => {
        const t = m.createdAt?.toDate();
        return t >= start && t <= end;
      })
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

    setSelectedDate(date);
    setMemories(list);
  };

  const handleDelete = async (memory) => {
    if (!window.confirm("Delete this memory?")) return;

    await deleteDoc(doc(db, "memories", memory.id));

    setMemories((prev) =>
      prev.filter((m) => m.id !== memory.id)
    );
  };

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (
      year === today.getFullYear() &&
      month === today.getMonth()
    )
      return;

    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  return (
    <div>
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h3>
          {new Date(year, month).toLocaleString(
            "default",
            { month: "long", year: "numeric" }
          )}
        </h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      <CalendarGrid
        datesWithMemories={datesWithMemories}
        onSelect={loadDate}
      />

      <CalendarDayView
        date={selectedDate}
        memories={memories}
        onDelete={handleDelete}
      />
    </div>
  );
}
