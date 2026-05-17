"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

function useTheme() {
  const [dark, setDark] = useState(true);
  return { dark, toggle: () => setDark((d) => !d) };
}

const IconMessage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

function TypingDots({ dark }: { dark: boolean }) {
  return (
    <div style={{
      display: "flex", gap: 4, alignItems: "center", padding: "10px 14px",
      background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
      borderRadius: 16, borderBottomLeftRadius: 4, width: "fit-content",
    }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i}
          style={{
            width: 6, height: 6, borderRadius: "50%",
            background: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", display: "block",
          }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </div>
  );
}

function Avatar({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0,
      fontFamily: "'Sora', sans-serif", letterSpacing: 0.3,
    }}>
      {label}
    </div>
  );
}

export default function Chat() {
  const { dark, toggle } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string; ts: string }[]>([
    { sender: "admin", text: "Hi there! 👋 How can I help you today?", ts: now() },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const dragControls = useDragControls();

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337");
    socketRef.current = socket;
    socket.on("adminMessage", (msg: { sender: string; text: string }) => {
      const entry = { sender: "admin", text: msg.text, ts: now() };
      setMessages((prev) => [...prev, entry]);
      setTyping(false);
      if (!isOpen) setUnread((u) => u + 1);
    });
    socket.on("adminTyping", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    });
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const entry = { sender: "visitor", text: message.trim(), ts: now() };
    socketRef.current?.emit("chatMessage", entry);
    setMessages((prev) => [...prev, entry]);
    setMessage("");
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const t = {
    bg: dark ? "#0f0f13" : "#ffffff",
    surface2: dark ? "#222230" : "#ebebf0",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    text: dark ? "#f0f0f5" : "#1a1a2e",
    textMuted: dark ? "rgba(240,240,245,0.45)" : "rgba(26,26,46,0.45)",
    accent: "#6366f1",
    adminBubble: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    adminText: dark ? "#e8e8f0" : "#1a1a2e",
    visitorBubble: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    visitorText: "#ffffff",
    headerBg: dark
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
      : "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
    inputBg: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    shadow: dark
      ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
      : "0 32px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
    glow: dark ? "0 0 40px rgba(99,102,241,0.15)" : "0 0 40px rgba(99,102,241,0.08)",
  };

  return (
    /*
      Single draggable container.
      flex-column stacks: [chat window] on top, [FAB] on bottom.
      alignItems: flex-start keeps width tight to content.
      FAB is always rendered — no AnimatePresence hiding it.
    */
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 50)}
      style={{
        position: "fixed",
        bottom: 24,
        left: 12,
        zIndex: 9999,
        touchAction: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
    >

      {/* ── Chat Window — above FAB ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            style={{
              width: 360, borderRadius: 20, overflow: "hidden",
              background: t.bg,
              boxShadow: `${t.shadow}, ${t.glow}`,
              border: `1px solid ${t.border}`,
              display: "flex", flexDirection: "column",
            }}
          >
            {/* Header — drag handle */}
            <div
              onPointerDown={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button")) return;
                dragControls.start(e);
              }}
              style={{
                background: t.headerBg,
                padding: "16px 18px", display: "flex",
                alignItems: "center", justifyContent: "space-between",
                borderBottom: `1px solid ${t.border}`,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <div className="font-heading" style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "linear-gradient(135deg,#a5b4fc,#6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: "#fff",
                    boxShadow: "0 0 0 3px rgba(255,255,255,0.15)",
                  }}>B</div>
                  <span style={{
                    position: "absolute", bottom: 1, right: 1,
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#22c55e", border: "2px solid",
                    borderColor: dark ? "#1a1a2e" : "#6366f1",
                  }}/>
                </div>
                <div>
                  <p className="font-heading" style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#fff", letterSpacing: 0.2 }}>
                    Live Support
                  </p>
                  <p className="font-sans" style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.65)", fontWeight: 300 }}>
                    ● Online · Replies instantly
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={toggle}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {dark ? <IconSun /> : <IconMoon />}
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconClose />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{
              height: 340, overflowY: "auto", padding: "16px 16px 8px",
              display: "flex", flexDirection: "column", gap: 10,
              background: t.bg, scrollbarWidth: "thin",
              scrollbarColor: `${t.border} transparent`,
            }}>
              {messages.map((msg, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.02 }}
                  style={{ display: "flex", gap: 8, justifyContent: msg.sender === "visitor" ? "flex-end" : "flex-start", alignItems: "flex-end" }}
                >
                  {msg.sender === "admin" && <Avatar label="A" color="linear-gradient(135deg,#6366f1,#818cf8)" />}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: msg.sender === "visitor" ? "flex-end" : "flex-start", gap: 3, maxWidth: "72%" }}>
                    <div className="font-sans" style={{
                      padding: "10px 14px", borderRadius: 16,
                      borderBottomLeftRadius: msg.sender === "admin" ? 4 : 16,
                      borderBottomRightRadius: msg.sender === "visitor" ? 4 : 16,
                      background: msg.sender === "admin" ? t.adminBubble : t.visitorBubble,
                      color: msg.sender === "admin" ? t.adminText : t.visitorText,
                      fontSize: 13.5, lineHeight: 1.55, fontWeight: 400,
                      boxShadow: msg.sender === "visitor" ? "0 4px 16px rgba(99,102,241,0.3)" : `0 2px 8px rgba(0,0,0,${dark ? 0.3 : 0.08})`,
                      border: msg.sender === "admin" ? `1px solid ${t.border}` : "none",
                      backdropFilter: "blur(8px)",
                    }}>
                      {msg.text}
                    </div>
                    <span className="font-sans" style={{ fontSize: 10.5, color: t.textMuted, paddingLeft: 4, paddingRight: 4 }}>
                      {msg.ts}
                    </span>
                  </div>
                  {msg.sender === "visitor" && <Avatar label="U" color="linear-gradient(135deg,#059669,#10b981)" />}
                </motion.div>
              ))}
              <AnimatePresence>
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                    style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <Avatar label="A" color="linear-gradient(135deg,#6366f1,#818cf8)" />
                    <TypingDots dark={dark} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ height: 1, background: t.border }} />

            {/* Input */}
            <div style={{ padding: "12px 14px", background: t.bg, display: "flex", gap: 10, alignItems: "center" }}>
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="font-sans"
                style={{
                  flex: 1, padding: "11px 16px", borderRadius: 12,
                  background: t.inputBg, border: `1px solid ${t.border}`,
                  color: t.text, fontSize: 13.5, outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => { e.target.style.borderColor = t.accent; }}
                onBlur={(e) => { e.target.style.borderColor = t.border; }}
              />
              <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
                onClick={sendMessage} disabled={!message.trim()} className="font-sans"
                style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: message.trim() ? "linear-gradient(135deg, #6366f1, #818cf8)" : t.surface2,
                  border: "none", cursor: message.trim() ? "pointer" : "default",
                  color: message.trim() ? "#fff" : t.textMuted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s",
                  boxShadow: message.trim() ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
                }}>
                <IconSend />
              </motion.button>
            </div>

            {/* Footer */}
            <div className="font-sans" style={{
              textAlign: "center", fontSize: 11, color: t.textMuted,
              padding: "8px 0 11px", background: t.bg, borderTop: `1px solid ${t.border}`,
            }}>
              Powered by{" "}
              <span className="font-heading" style={{ fontWeight: 600, color: t.accent }}>
                Bitmutex Technologies
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB — always visible, toggles chat, also drag handle ── */}
      <motion.button
        whileHover={{ scale: isDragging ? 1 : 1.05 }}
        whileTap={{ scale: isDragging ? 1 : 0.95 }}
        onPointerDown={(e) => dragControls.start(e)}
        onClick={() => {
          if (!isDragging) setIsOpen((prev) => !prev);
        }}
        className="font-heading"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "9px 18px",
          borderRadius: 50,

          // Gradient backgrounds
          background: isOpen
            ? "linear-gradient(135deg, #ff7b00 0%, #ff3d00 100%)"
            : "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",

          color: "#fff",
          border: "1px solid rgba(255,255,255,0.12)",
          cursor: isDragging ? "grabbing" : "grab",
          fontSize: 14,
          fontWeight: 600,

          //layered shadow
          boxShadow: isOpen
            ? "0 10px 25px rgba(255, 98, 0, 0.35), inset 0 1px 1px rgba(255,255,255,0.15)"
            : "0 10px 25px rgba(79, 70, 229, 0.35), inset 0 1px 1px rgba(255,255,255,0.15)",

          backdropFilter: "blur(10px)",
          userSelect: "none",

          transition:
            "background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease",
        }}
      >
        {isOpen ? <IconClose /> : <IconMessage />}
        {isOpen ? "Close" : "Chat"}

        {/* Unread badge */}
        {!isOpen && unread > 0 && (
          <span style={{
            position: "absolute", top: -6, right: -6,
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 6px rgba(239,68,68,0.5)",
          }}>
            {unread}
          </span>
        )}
      </motion.button>

    </motion.div>
  );
}