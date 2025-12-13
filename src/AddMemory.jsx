import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth, storage } from "./firebase";

export default function AddMemory({ editing, close, memory }) {
  const [text, setText] = useState(memory?.text || "");
  const [image, setImage] = useState(null);

  const triggerHeart = () => {
    const heart = document.createElement("div");
    heart.className = "heart";
    heart.style.left = Math.random() * 90 + "%";
    heart.innerText = "❤️";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 2500);
  };

  const save = async () => {
    let imageUrl = memory?.imageUrl || null;

    if (image) {
      const imageRef = ref(
        storage,
        `memories/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    if (editing) {
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

    triggerHeart();
    close();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editing ? "Edit memory" : "New memory"}</h3>

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
          <button onClick={close}>Cancel</button>
          <button onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
