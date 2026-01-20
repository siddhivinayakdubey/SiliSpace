/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HUGS = [
  { type: "warm", emoji: "🤗", name: "Warm Hug" },
  { type: "tight", emoji: "💕", name: "Tight Hug" },
  { type: "bear", emoji: "🐻", name: "Bear Hug" },
  { type: "love", emoji: "❤️", name: "Love Hug" },
  { type: "miss", emoji: "💖", name: "Miss You Hug" },
  { type: "comfort", emoji: "💞", name: "Comfort Hug" }
];

export default function VirtualHugs({ roomCode, myName }) {
  const [hugs, setHugs] = useState([]);
  const [sending, setSending] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchHugs();
    const interval = setInterval(fetchHugs, 5000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const fetchHugs = async () => {
    try {
      const response = await axios.get(`${API}/hugs/${roomCode}`);
      setHugs(response.data);
    } catch (error) {
      console.error("Failed to fetch hugs", error);
    }
  };

  const sendHug = async (hugType) => {
    setSending(true);
    try {
      await axios.post(`${API}/hugs/send`, {
        room_code: roomCode,
        sender: myName,
        hug_type: hugType.type
      });

      toast.success(`${hugType.name} sent!`);
      fetchHugs();
    } catch (error) {
      toast.error("Failed to send hug");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Virtual Hugs</h2>

      {/* Send Hug */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ color: '#8A8A8A' }}>Send a warm hug:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {HUGS.map((hug) => (
            <motion.button
              data-testid={`hug-${hug.type}`}
              key={hug.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => sendHug(hug)}
              disabled={sending}
              className="p-6 rounded-2xl border-2 border-pink-100 hover:border-pink-300 hover:bg-pink-50 transition-all"
            >
              <div className="text-5xl mb-2">{hug.emoji}</div>
              <div className="text-sm font-bold" style={{ color: '#4A4A4A' }}>{hug.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Received Hugs */}
      <div>
        <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>Received Hugs</h3>
        {hugs.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#8A8A8A' }}>No hugs yet. Send the first one!</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hugs.map((hug, index) => {
              const hugInfo = HUGS.find(h => h.type === hug.hug_type) || HUGS[0];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-pink-50 rounded-2xl p-4 border border-pink-100 text-center"
                  data-testid={`received-hug-${index}`}
                >
                  <div className="text-4xl mb-2">{hugInfo.emoji}</div>
                  <p className="font-bold mb-1" style={{ color: '#4A4A4A' }}>From: {hug.sender}</p>
                  <p className="text-sm" style={{ color: '#8A8A8A' }}>{hugInfo.name}</p>
                  <p className="text-xs mt-2" style={{ color: '#8A8A8A' }}>
                    {new Date(hug.sent_at).toLocaleString()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}