import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Sparkles, Star } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CARD_TYPES = [
  {
    type: "classic",
    name: "Classic Love",
    emoji: "💝",
    color: "#FF8FA3",
    bgColor: "#FFF0F3"
  },
  {
    type: "cute",
    name: "Super Cute",
    emoji: "🥰",
    color: "#FFB3C1",
    bgColor: "#FFF5F7"
  },
  {
    type: "romantic",
    name: "Romantic",
    emoji: "💗",
    color: "#FF6B9D",
    bgColor: "#FFE5EF"
  },
  {
    type: "sweet",
    name: "Sweet Heart",
    emoji: "💖",
    color: "#FF8FB4",
    bgColor: "#FFF0F5"
  },
  {
    type: "forever",
    name: "Forever Yours",
    emoji: "💕",
    color: "#FFA0BE",
    bgColor: "#FFF3F7"
  },
  {
    type: "adorable",
    name: "Adorable",
    emoji: "💓",
    color: "#FF99B8",
    bgColor: "#FFF2F6"
  }
];

export default function ValentineCards({ roomCode, myName }) {
  const [cards, setCards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedToView, setSelectedToView] = useState(null);

  const fetchCards = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/valentine/${roomCode}`);
      setCards(response.data);
    } catch (error) {
      console.error("Failed to fetch valentine cards", error);
    }
  }, [roomCode]);

  useEffect(() => {
    fetchCards();
    const interval = setInterval(fetchCards, 5000);
    return () => clearInterval(interval);
  }, [fetchCards]);

  const sendCard = async () => {
    if (!selectedCard) {
      toast.error("Please select a card design");
      return;
    }
    if (!message.trim()) {
      toast.error("Please write a message");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API}/valentine/send`, {
        room_code: roomCode,
        sender: myName,
        card_type: selectedCard.type,
        message: message.trim()
      });

      toast.success("Valentine card sent! 💝");
      setShowCreateModal(false);
      setSelectedCard(null);
      setMessage("");
      fetchCards();
    } catch (error) {
      toast.error("Failed to send card");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      {/* Header with floating hearts */}
      <div className="relative mb-8">
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -left-2 text-3xl"
        >
          💝
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -8, 0, 8, 0]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -top-4 right-10 text-2xl"
        >
          💕
        </motion.div>
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-0 right-0 text-xl"
        >
          💖
        </motion.div>
        
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center" style={{ color: '#4A4A4A' }}>
          Be My Valentine 💝
        </h2>
        <p className="text-center mt-2" style={{ color: '#8A8A8A' }}>
          Send adorable valentine cards to your special someone
        </p>
      </div>

      {/* Create Card Button */}
      <motion.div 
        className="text-center mb-8"
        whileHover={{ scale: 1.02 }}
      >
        <Button
          data-testid="create-valentine-btn"
          onClick={() => setShowCreateModal(true)}
          className="rounded-full px-12 py-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
        >
          <Heart className="mr-2 h-6 w-6" />
          Create Valentine Card
        </Button>
      </motion.div>

      {/* Create Card Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-heading text-2xl font-bold mb-6 text-center" style={{ color: '#4A4A4A' }}>
                Create Your Valentine Card
              </h3>

              {/* Card Type Selection */}
              <div className="mb-6">
                <p className="text-sm mb-3 font-medium" style={{ color: '#8A8A8A' }}>Choose a card design:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CARD_TYPES.map((card) => (
                    <motion.button
                      key={card.type}
                      data-testid={`card-type-${card.type}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCard(card)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedCard?.type === card.type
                          ? 'border-primary shadow-md'
                          : 'border-pink-100 hover:border-pink-200'
                      }`}
                      style={{ 
                        backgroundColor: selectedCard?.type === card.type ? card.bgColor : '#FFF9F5'
                      }}
                    >
                      <div className="text-4xl mb-2">{card.emoji}</div>
                      <div className="text-sm font-bold" style={{ color: card.color }}>{card.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              {selectedCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <p className="text-sm mb-2 font-medium" style={{ color: '#8A8A8A' }}>Write your message:</p>
                  <Textarea
                    data-testid="valentine-message-input"
                    placeholder="Dear Valentine, you make my heart skip a beat..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="rounded-2xl mb-4"
                    rows={5}
                    style={{ backgroundColor: selectedCard.bgColor }}
                  />
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  data-testid="send-valentine-btn"
                  onClick={sendCard}
                  disabled={sending}
                  className="flex-1 rounded-full py-6 font-bold"
                  style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
                >
                  {sending ? "Sending..." : "Send Card 💝"}
                </Button>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedCard(null);
                    setMessage("");
                  }}
                  variant="outline"
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Received Cards */}
      <div>
        <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>
          Valentine Cards 💌
        </h3>
        {cards.length === 0 ? (
          <div className="text-center py-12 bg-pink-50 rounded-3xl">
            <div className="text-6xl mb-4">💝</div>
            <p style={{ color: '#8A8A8A' }}>No cards yet. Be the first to send one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card, index) => {
              const cardType = CARD_TYPES.find(c => c.type === card.card_type) || CARD_TYPES[0];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                  className="cursor-pointer relative"
                  onClick={() => setSelectedToView(card)}
                  data-testid={`valentine-card-${index}`}
                >
                  <div 
                    className="rounded-3xl p-6 border-2 border-pink-200 shadow-sm hover:shadow-lg transition-all relative overflow-hidden"
                    style={{ backgroundColor: cardType.bgColor }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-2 right-2 text-2xl opacity-50">{cardType.emoji}</div>
                    <div className="absolute bottom-2 left-2 text-xl opacity-30">💕</div>
                    
                    <div className="text-5xl mb-3 text-center">{cardType.emoji}</div>
                    <p className="font-bold text-center mb-2" style={{ color: cardType.color }}>
                      {cardType.name}
                    </p>
                    <p className="text-sm mb-2 text-center font-medium" style={{ color: '#4A4A4A' }}>
                      From: {card.sender}
                    </p>
                    <p className="text-xs text-center line-clamp-2" style={{ color: '#8A8A8A' }}>
                      {card.message}
                    </p>
                    <p className="text-xs text-center mt-2" style={{ color: '#8A8A8A' }}>
                      {new Date(card.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Card Modal */}
      <AnimatePresence>
        {selectedToView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedToView(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const cardType = CARD_TYPES.find(c => c.type === selectedToView.card_type) || CARD_TYPES[0];
                return (
                  <div 
                    className="rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                    style={{ backgroundColor: cardType.bgColor }}
                  >
                    {/* Decorative floating elements */}
                    <motion.div
                      animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-4 left-4 text-3xl opacity-40"
                    >
                      💝
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute top-4 right-4 text-3xl opacity-40"
                    >
                      💖
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="absolute bottom-4 left-8 text-2xl opacity-40"
                    >
                      💕
                    </motion.div>
                    <motion.div
                      animate={{ y: [0, -8, 0], rotate: [0, -12, 0] }}
                      transition={{ duration: 2.8, repeat: Infinity }}
                      className="absolute bottom-4 right-8 text-2xl opacity-40"
                    >
                      💗
                    </motion.div>

                    <div className="relative z-10">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-7xl mb-4 text-center"
                      >
                        {cardType.emoji}
                      </motion.div>
                      
                      <h3 className="font-heading text-3xl font-bold text-center mb-4" style={{ color: cardType.color }}>
                        {cardType.name}
                      </h3>
                      
                      <div className="bg-white/70 rounded-2xl p-6 mb-4 backdrop-blur-sm">
                        <p className="text-lg text-center leading-relaxed" style={{ color: '#4A4A4A' }}>
                          {selectedToView.message}
                        </p>
                      </div>

                      <p className="text-center font-bold mb-1" style={{ color: '#4A4A4A' }}>
                        From: {selectedToView.sender} 💝
                      </p>
                      <p className="text-sm text-center" style={{ color: '#8A8A8A' }}>
                        {new Date(selectedToView.sent_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>

                      <Button
                        onClick={() => setSelectedToView(null)}
                        className="w-full mt-6 rounded-full py-6 font-bold"
                        style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
