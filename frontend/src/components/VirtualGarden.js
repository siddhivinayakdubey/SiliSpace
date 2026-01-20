/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FLOWERS = [
  { type: "rose", emoji: "🌹", name: "Red Rose" },
  { type: "tulip", emoji: "🌷", name: "Pink Tulip" },
  { type: "sunflower", emoji: "🌻", name: "Sunflower" },
  { type: "cherry", emoji: "🌸", name: "Cherry Blossom" },
  { type: "hibiscus", emoji: "🌺", name: "Hibiscus" },
  { type: "bouquet", emoji: "💐", name: "Bouquet" }
];

export default function VirtualGarden({ roomCode, myName }) {
  const [flowers, setFlowers] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchFlowers();
    const interval = setInterval(fetchFlowers, 5000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const fetchFlowers = async () => {
    try {
      const response = await axios.get(`${API}/flowers/${roomCode}`);
      setFlowers(response.data);
    } catch (error) {
      console.error("Failed to fetch flowers", error);
    }
  };

  const sendFlower = async () => {
    if (!selectedFlower) {
      toast.error("Please select a flower");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API}/flowers/send`, {
        room_code: roomCode,
        sender: myName,
        flower_type: selectedFlower.type,
        message: message.trim() || null
      });

      toast.success(`${selectedFlower.name} sent!`);
      setSelectedFlower(null);
      setMessage("");
      fetchFlowers();
    } catch (error) {
      toast.error("Failed to send flower");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Virtual Garden</h2>

      {/* Flower Selection */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ color: '#8A8A8A' }}>Choose a flower to send:</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {FLOWERS.map((flower) => (
            <motion.button
              data-testid={`flower-${flower.type}`}
              key={flower.type}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFlower(flower)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedFlower?.type === flower.type
                  ? 'border-primary bg-pink-50'
                  : 'border-pink-100 hover:border-pink-200'
              }`}
            >
              <div className="text-4xl mb-2">{flower.emoji}</div>
              <div className="text-xs font-medium" style={{ color: '#4A4A4A' }}>{flower.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      {selectedFlower && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <Textarea
            data-testid="flower-message-input"
            placeholder="Add a sweet message (optional)..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mb-4 rounded-2xl"
            rows={3}
          />
          <Button
            data-testid="send-flower-btn"
            onClick={sendFlower}
            disabled={sending}
            className="w-full md:w-auto rounded-full px-8 py-6 font-bold"
            style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
          >
            {sending ? "Sending..." : `Send ${selectedFlower.name}`}
          </Button>
        </motion.div>
      )}

      {/* Received Flowers */}
      <div>
        <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>Received Flowers</h3>
        {flowers.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#8A8A8A' }}>No flowers yet. Be the first to send one!</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {flowers.map((flower, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-pink-50 rounded-2xl p-4 border border-pink-100"
                data-testid={`received-flower-${index}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">
                    {FLOWERS.find(f => f.type === flower.flower_type)?.emoji || "🌹"}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold mb-1" style={{ color: '#4A4A4A' }}>From: {flower.sender}</p>
                    {flower.message && (
                      <p className="text-sm" style={{ color: '#8A8A8A' }}>{flower.message}</p>
                    )}
                    <p className="text-xs mt-2" style={{ color: '#8A8A8A' }}>
                      {new Date(flower.sent_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}