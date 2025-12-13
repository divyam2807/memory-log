import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, auth, storage } from "./firebase";
import { USER_NAMES } from "./constants";

export default function MemoryList({ onEdit }) {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "memories"), orderBy("createdAt", "desc"));

    return onSnapshot(q, (snap) => {
      setMemories(
        snap.docs.map((d, i) => ({
          id: d.id,
          index: snap.size - i,
          ...d.data(),
        }))
      );
    });
  }, []);

  const remove = async (memory) => {
    if (!window.confirm("Delete this memory forever?")) return;

    if (memory.imageUrl) {
      const imageRef = ref(storage, memory.imageUrl);
      await deleteObject(imageRef);
    }

    await deleteDoc(doc(db, "memories", memory.id));
  };

  return (
    <div className="timeline">
      {memories.map((m) => {
        const isOwner = m.author === auth.currentUser.email;
        const date = m.createdAt?.toDate()?.toDateString();

        return (
          <div key={m.id} className="timeline-item">
            <div className="timeline-number">{m.index}</div>

            <div className="timeline-card">
              <p>{m.text}</p>

              {m.imageUrl && <img src={m.imageUrl} className="memory-image" />}

              <small>
                {date} — {USER_NAMES[m.author]}
              </small>

              {isOwner && (
                <div className="actions">
                  <button onClick={() => onEdit(m)}>Edit</button>
                  <button onClick={() => remove(m.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
