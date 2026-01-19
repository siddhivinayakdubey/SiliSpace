import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LoveNotes({ roomCode, myName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomCode]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/messages/${roomCode}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Please write a message");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API}/messages/send`, {
        room_code: roomCode,
        sender: myName,
        content: newMessage.trim()
      });

      toast.success("Love note sent!");
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Love Notes</h2>

      {/* Send Message */}
      <div className="mb-8">
        <Textarea
          data-testid="love-note-input"
          placeholder="Write a sweet message to your loved one..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="mb-4 rounded-2xl"
          rows={4}
        />
        <Button
          data-testid="send-love-note-btn"
          onClick={sendMessage}
          disabled={sending}
          className="w-full md:w-auto rounded-full px-8 py-6 font-bold"
          style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
        >
          {sending ? "Sending..." : "Send Love Note"}
        </Button>
      </div>

      {/* Messages List */}
      <div>
        <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>Messages</h3>
        {messages.length === 0 ? (
          <p className="text-center py-8" style={{ color: '#8A8A8A' }}>No messages yet. Send the first love note!</p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === myName ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-2xl ${
                  msg.sender === myName
                    ? 'bg-pink-100 ml-auto'
                    : 'bg-secondary/20 mr-auto'
                } max-w-md`}
                data-testid={`love-note-${index}`}
              >
                <p className="font-bold mb-2" style={{ color: '#4A4A4A' }}>{msg.sender}</p>
                <p className="text-base mb-2" style={{ color: '#4A4A4A' }}>{msg.content}</p>
                <p className="text-xs" style={{ color: '#8A8A8A' }}>
                  {new Date(msg.sent_at).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}