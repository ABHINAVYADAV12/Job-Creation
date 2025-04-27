"use client";
import { useState, useRef, useEffect } from "react";

const suggestions = [
  "How can I improve my profile?",
  "What jobs match my skills?",
  "How do I apply for a job?",
  "Show me trending companies.",
  "How do I save jobs for later?",
  "Tips for getting hired fast?"
];

// Helper: keep value within bounds
function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I'm your Career Assistant. Ask me anything about the job portal or choose a suggestion below!" }
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcut (Esc to minimize)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!minimized && (e.key === "Escape" || e.key === "Esc")) setMinimized(true);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [minimized]);

  // Drag logic
  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!dragging) return;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const width = chatRef.current?.offsetWidth || 320;
      const height = chatRef.current?.offsetHeight || 400;
      let x = e.clientX - dragOffset.current.x;
      let y = e.clientY - dragOffset.current.y;
      // Clamp to viewport
      x = clamp(x, 0, winW - width - 8);
      y = clamp(y, 0, winH - height - 8);
      setDrag({ x, y });
    }
    function onUp() { setDragging(false); }
    if (dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  async function handleSend(message: string) {
    setMessages(msgs => [...msgs, { from: "user", text: message }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: "bot", text: getBotReply(message) }]);
      setLoading(false);
    }, 1000);
  }

  function getBotReply(msg: string) {
    if (msg.toLowerCase().includes("profile")) return "Go to your profile page to edit details and upload a resume. Complete all fields for better visibility!";
    if (msg.toLowerCase().includes("skills")) return "Try searching for jobs by your key skills in the search bar. We'll show you the best matches!";
    if (msg.toLowerCase().includes("apply")) return "Click on a job and use the 'Apply' button. Make sure your profile is up to date!";
    if (msg.toLowerCase().includes("trending")) return "Check the home page for trending companies and jobs updated daily.";
    if (msg.toLowerCase().includes("save")) return "Click the bookmark icon on any job card to save it for later in your Saved Jobs.";
    if (msg.toLowerCase().includes("tips")) return "Keep your resume updated, apply early, and tailor your applications to each job!";
    return "I'm here to help! Try asking about jobs, companies, or how to use the portal.";
  }

  // Minimized button
  if (minimized) {
    return (
      <button
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-2xl p-4 flex items-center gap-2 focus:outline-none border-2 border-white"
        onClick={() => setMinimized(false)}
        aria-label="Open ChatBot"
      >
        <span role="img" aria-label="robot">🤖</span>
        <span className="font-bold text-lg hidden sm:inline">ChatBot</span>
      </button>
    );
  }

  return (
    <div
      ref={chatRef}
      className="fixed z-50 w-80 max-w-full bg-white rounded-xl shadow-2xl border border-purple-200 flex flex-col"
      style={{
        left: drag.x ? drag.x : undefined,
        top: drag.y ? drag.y : undefined,
        right: drag.x ? undefined : 24,
        bottom: drag.y ? undefined : 24,
        cursor: dragging ? 'grabbing' : 'default',
      }}
    >
      <div
        className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-3 rounded-t-xl font-bold text-lg flex items-center gap-2 justify-between select-none cursor-grab"
        onMouseDown={e => {
          setDragging(true);
          const rect = chatRef.current?.getBoundingClientRect();
          dragOffset.current = {
            x: e.clientX - (rect?.left || 0),
            y: e.clientY - (rect?.top || 0),
          };
        }}
        style={{ userSelect: 'none' }}
      >
        <span className="flex items-center gap-2"><span role="img" aria-label="robot">🤖</span> Career ChatBot</span>
        <button
          className="ml-2 px-2 py-0.5 rounded hover:bg-purple-700/30 text-white text-xl font-bold focus:outline-none"
          onClick={() => setMinimized(true)}
          aria-label="Minimize ChatBot"
        >
          –
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto max-h-96 min-h-[200px]">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${m.from === 'user' ? 'bg-purple-100 text-purple-900' : 'bg-blue-50 text-blue-800'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400">Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="px-4 pb-3">
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-xs border border-purple-200 transition"
              onClick={() => handleSend(s)}
              disabled={loading}
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
            type="text"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
            disabled={!input.trim() || loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
