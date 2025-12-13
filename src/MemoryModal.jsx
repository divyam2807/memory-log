import { useState, useEffect } from "react";
import {
  addDoc,
  updateDoc,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";

export default function MemoryModal({ mode, memory, onClose }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === "edit" && memory) {
      setText(memory.text || "");
    } else {
      setText("");
    }
  }, [mode, memory]);

  const triggerHeart = () => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 80 + 10 + "%";
    heart.innerText = "💫";
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 3000);
  };

  const save = async () => {
    if (!text.trim()) return;
    setSaving(true);

    try {
      let imageUrl = memory?.imageUrl || null;

      if (image) {
        const imageRef = ref(
          storage,
          `memories/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      if (mode === "edit") {
        await updateDoc(doc(db, "memories", memory.id), {
          text,
          imageUrl,
        });
      } else {
        await addDoc(collection(db, "memories"), {
          text,
          imageUrl,
          author: auth.currentUser.email,
          createdAt: serverTimestamp(),
        });
      }
      document.body.classList.add("cosmic-pulse");
      setTimeout(() => {
        document.body.classList.remove("cosmic-pulse");
      }, 1200);

      triggerHeart();
      onClose();
    } catch (e) {
      console.log("Save failed. Check permissions.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{mode === "edit" ? "Edit memory" : "New memory"}</h3>

        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="modal-actions">
          <button onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
