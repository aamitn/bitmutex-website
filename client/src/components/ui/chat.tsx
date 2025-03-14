"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_STRAPI_BASE_URL || "http://localhost:1337");

    socketRef.current = socket;

    const handleAdminMessage = (msg: { sender: string; text: string }) => {
      setMessages((prev) => [...prev, { sender: "admin", text: msg.text }]);
      setTyping(false);
    };

    const handleTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    };

    socket.on("adminMessage", handleAdminMessage);
    socket.on("adminTyping", handleTyping);

    return () => {
      socket.off("adminMessage", handleAdminMessage);
      socket.off("adminTyping", handleTyping);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      const chatMessage = { text: message, sender: "visitor" };
      socketRef.current.emit("chatMessage", chatMessage);
      setMessages((prev) => [...prev, chatMessage]);
      setMessage("");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl hover:scale-105 transition-transform"
            >
              💬 Chat
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 w-80 z-50"
          >
            <Card className="shadow-2xl border border-gray-200 bg-white/90 backdrop-blur-md rounded-xl">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl">
                <h3 className="font-semibold">Live Support</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="text-white hover:text-gray-200"
                >
                  ✖
                </Button>
              </div>

              <ScrollArea className="h-60 p-4 space-y-3" ref={chatWindowRef}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={cn(
                      "flex items-start gap-2",
                      msg.sender === "visitor" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender === "admin" && (
                      <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white font-semibold rounded-full shadow-md">
                        A
                      </div>
                    )}
                    <motion.p
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "px-3 py-2 rounded-lg max-w-[75%] text-sm shadow",
                        msg.sender === "admin"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-indigo-500 text-white"
                      )}
                    >
                      {msg.text}
                    </motion.p>
                    {msg.sender === "visitor" && (
                      <div className="w-8 h-8 flex items-center justify-center bg-green-500 text-white font-semibold rounded-full shadow-md">
                        U
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex items-center gap-2 justify-start"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white font-semibold rounded-full shadow-md">
                      A
                    </div>
                    <div className="bg-gray-200 px-3 py-2 rounded-lg text-sm flex gap-1">
                      <span className="animate-pulse">.</span>
                      <span className="animate-pulse delay-200">.</span>
                      <span className="animate-pulse delay-400">.</span>
                    </div>
                  </motion.div>
                )}
              </ScrollArea>

              <div className="p-4 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform"
                >
                  Send
                </Button>
              </div>

              {/* Powered By Footer */}
              <div className="text-center text-xs text-gray-500 p-2 bg-gray-100 rounded-b-xl">
                Powered by <span className="font-semibold text-indigo-600">Bitmutex Technologies</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
