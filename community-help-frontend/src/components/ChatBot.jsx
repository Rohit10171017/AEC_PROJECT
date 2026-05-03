import { useState, useRef } from "react";

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am your Community Assistant!"
    }
  ]);

  const [input, setInput] = useState("");

  /* POSITION */
  const [position, setPosition] = useState({
    x: 30,
    y: window.innerHeight - 100
  });

  const dragging = useRef(false);

  /* START DRAG */
  const handleMouseDown = () => {
    dragging.current = true;
  };

  /* STOP DRAG */
  const handleMouseUp = () => {
    dragging.current = false;
  };

  /* DRAGGING */
  const handleMouseMove = (e) => {

    if (!dragging.current) return;

    const newX = Math.min(
      window.innerWidth - 80,
      Math.max(0, e.clientX - 30)
    );

    const newY = Math.min(
      window.innerHeight - 80,
      Math.max(0, e.clientY - 30)
    );

    setPosition({
      x: newX,
      y: newY
    });

  };

  /* SEND MESSAGE */
  const sendMessage = () => {

    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    let botReply = "";

    const text = input.toLowerCase();

    if (text.includes("post")) {

      botReply =
        "📝 Use the floating + button to create posts.";

    }

    else if (text.includes("report")) {

      botReply =
        "🚩 Use report button to flag suspicious posts.";

    }

    else if (text.includes("help")) {

      botReply =
        "🤝 Users can request or offer community help.";

    }

    else {

      botReply =
        "🤖 I'm still learning. Try asking about posts or reports.";

    }

    const botMessage = {
      sender: "bot",
      text: botReply
    };

    setMessages([
      ...messages,
      userMessage,
      botMessage
    ]);

    setInput("");

  };

  return (

    <div
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* DRAGGABLE BUTTON */}
      <button
        className="chatbot-toggle"

        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}

        onMouseDown={handleMouseDown}

        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

      {/* CHAT WINDOW */}
      {open && (

        <div
          className="chatbot"

          style={{
            left: `${position.x}px`,
            top: `${position.y - 430}px`
          }}
        >

          <div className="chat-header">
            Community Assistant
          </div>

          <div className="chat-messages">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`msg ${msg.sender}`}
              >
                {msg.text}
              </div>

            ))}

          </div>

          <div className="chat-input">

            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
            />

            <button onClick={sendMessage}>
              Send
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ChatBot;