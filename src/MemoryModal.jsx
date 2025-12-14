import { useState } from "react";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function MemoryModal({
  mode,
  memory,
  onClose,
}) {
  const [text, setText] = useState(memory?.text || "");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const saveMemory = async () => {
    if (!text.trim()) return;

    setSaving(true);

    let imageUrl = memory?.imageUrl || null;

    try {
      if (file) {
        const fileRef = ref(
          storage,
          `memories/${auth.currentUser.uid}/${Date.now()}_${file.name}`
        );

        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }

      if (mode === "edit") {
        await updateDoc(
          doc(db, "memories", memory.id),
          {
            text,
            imageUrl,
            editedAt: serverTimestamp(),
          }
        );
      } else {
        await addDoc(collection(db, "memories"), {
          text,
          imageUrl,
          author: auth.currentUser.email,
          createdAt: serverTimestamp(),
        });
      }

      onClose(true); 
    } catch (e) {
      alert("Could not save memory.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>
          {mode === "edit" ? "Edit memory" : "New memory"}
        </h3>

        <textarea
          placeholder="Write something…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div className="modal-actions">
          <button onClick={() => onClose(false)}>
            Cancel
          </button>

          <button
            onClick={saveMemory}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
