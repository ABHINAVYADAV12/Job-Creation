"use client";
import { useState, useRef, useEffect } from "react";

const adminSuggestions = [
  "How do I add a new job?",
  "How can I manage users?",
  "Show me analytics for jobs.",
  "How do I edit company details?",
  "How can I publish or unpublish a job?",
  "Tips for managing the portal efficiently?"
];

function getAdminBotReply(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("add") && m.includes("job")) return "Go to 'Jobs' in the sidebar and use the 'New Job' button to add a posting.";
  if (m.includes("manage") && m.includes("users")) return "Visit the 'Users' section in the sidebar to view, promote, or demote users.";
  if (m.includes("analytics")) return "Check the 'Analytics' page in the sidebar for job and company stats.";
  if (m.includes("edit") && m.includes("company")) return "Go to 'Companies', select a company, and use the edit forms for details, logo, and cover image.";
  if (m.includes("publish") || m.includes("unpublish")) return "Open a job from 'Jobs', then use the Publish/Unpublish button on the job details page.";
  if (m.includes("tips") || m.includes("efficient")) return "Regularly review jobs and users, keep company info up to date, and use analytics to guide your actions!";
  return "I'm your Admin Assistant! Ask about admin features, user management, or portal tips.";
}

export default function AdminChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi Admin! I'm your assistant. Ask me about managing jobs, users, or companies." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!minimized) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, minimized]);

  function handleSuggestionClick(s: string) {
    handleSend(s);
  }

  async function handleSend(message: string) {
    setMessages(msgs => [...msgs, { from: "user", text: message }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: "bot", text: getAdminBotReply(message) }]);
      setLoading(false);
    }, 800);
  }

  function onDown(e: React.MouseEvent) {
    setDragging(true);
    const rect = chatRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left || 0),
      y: e.clientY - (rect?.top || 0),
    };
  }
  function onUp() { setDragging(false); }
  function onMove(e: MouseEvent) {
    if (!dragging) return;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const width = chatRef.current?.offsetWidth || 320;
    const height = chatRef.current?.offsetHeight || 400;
    let x = e.clientX - dragOffset.current.x;
    let y = e.clientY - dragOffset.current.y;
    // Clamp to viewport
    x = Math.max(0, Math.min(x, winW - width - 8));
    y = Math.max(0, Math.min(y, winH - height - 8));
    setDrag({ x, y });
  }
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  });

  if (minimized) {
    return (
      <button
        className="fixed z-[100] bottom-6 right-6 bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-800"
        onClick={() => setMinimized(false)}
      >
        Admin ChatBot
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed z-[100] bottom-6 right-6 w-80 h-96 bg-white border-2 border-blue-500 rounded-xl shadow-2xl flex flex-col"
      style={{ left: drag.x, top: drag.y, cursor: dragging ? 'grabbing' : 'grab' }}
    >
      <div
        className="bg-blue-700 text-white px-4 py-2 rounded-t-xl flex justify-between items-center select-none"
        onMouseDown={onDown}
        style={{ userSelect: 'none' }}
      >
        <span className="flex items-center gap-2"><span role="img" aria-label="robot">🛠️</span> Admin ChatBot</span>
        <button
          className="ml-2 px-2 py-0.5 rounded hover:bg-blue-800/30 text-white text-xl font-bold focus:outline-none"
          onClick={() => setMinimized(true)}
          aria-label="Minimize ChatBot"
        >
          –
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-blue-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg px-3 py-2 max-w-[80%] ${m.from === "user" ? "bg-blue-600 text-white" : "bg-white border border-blue-300 text-blue-900"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2 bg-white border border-blue-300 text-blue-900">Thinking...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-2 border-t bg-white">
        <div className="flex gap-2 mb-2 flex-wrap">
          {adminSuggestions.map((s, i) => (
            <button
              key={i}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded px-2 py-1"
              onClick={() => handleSuggestionClick(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) handleSend(input.trim());
          }}
        >
          <input
            className="flex-1 border border-blue-300 rounded-lg px-2 py-1 focus:outline-none"
            placeholder="Ask something..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1 disabled:bg-gray-400"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
