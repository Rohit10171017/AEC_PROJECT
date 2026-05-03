import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "need",
    category: "",
    location: "",
    image: "",
  });

  const [preview, setPreview] = useState("");

  const [scamWarning, setScamWarning] = useState("");

  const [blocked, setBlocked] = useState(false);

  /* HANDLE INPUT */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* HANDLE IMAGE */
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm({
        ...form,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setForm({
          ...form,
          location: `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`,
        });
      },

      () => {
        alert("Unable to fetch location");
      },
    );
  };

  const detectScam = (text = "") => {
    text = text.toLowerCase();

    /* HIGH RISK FINANCIAL */
    if (
      text.includes("send money") ||
      text.includes("urgent payment") ||
      text.includes("bank account") ||
      text.includes("upi pin") ||
      text.includes("credit card")
    ) {
      setScamWarning(
        "🚫 This post appears highly suspicious and has been blocked.",
      );

      setBlocked(true);
    } else if (

    /* EXTREME URGENCY */
      text.includes("immediately") ||
      text.includes("urgent") ||
      text.includes("asap")
    ) {
      setScamWarning(
        "⚠️ Posts with extreme urgency should include clear details.",
      );

      setBlocked(false);
    } else if (text.includes("whatsapp") || text.includes("telegram")) {

    /* EXTERNAL CONTACT */
      setScamWarning(
        "⚠️ Be careful sharing external contact details publicly.",
      );

      setBlocked(false);
    } else if (text.trim().length < 15) {

    /* TOO VAGUE */
      setScamWarning("⚠️ Add more details for trust and clarity.");

      setBlocked(false);
    } else {

    /* SAFE */
      setScamWarning("");

      setBlocked(false);
    }
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post("/posts", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post created successfully!");

      setPreview("");
    } catch (err) {
      toast.error("Error creating post");
    }
  };

  return (
    <div className="card">
      <h2>Create Post</h2>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} />

        <textarea
          name="description"
          placeholder="Description"
          onChange={(e) => {
            handleChange(e);

            setTimeout(() => {
              detectScam(e.target.value);
            }, 200);
          }}
        />

        <select name="type" onChange={handleChange}>
          <option value="need">Need</option>

          <option value="offer">Offer</option>
        </select>

        <input name="category" placeholder="Category" onChange={handleChange} />

        <div className="location-box">
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <button type="button" className="location-btn" onClick={getLocation}>
            📍 Use My Location
          </button>
        </div>

        {/* IMAGE INPUT */}
        <input type="file" accept="image/*" onChange={handleImage} />

        {/* PREVIEW */}
        {preview && <img src={preview} alt="preview" className="preview-img" />}

        {/* SCAM WARNING */}

        {scamWarning && (
          <div className="scam-warning">
            <h4>🤖 AI Safety Check</h4>

            <p>{scamWarning}</p>
          </div>
        )}

        <button
          className={`main-btn ${blocked ? "blocked-btn" : ""}`}
          disabled={blocked}
        >
          {blocked ? "Blocked 🚫" : "Create"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
