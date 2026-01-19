import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import "@/App.css";

const EMOJIS = ["❤️", "💕", "💖", "💗", "💝", "💞", "🌹", "🌻"];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const initGame = () => {
    const pairs = EMOJIS.slice(0, 6);
    const deck = shuffleArray([...pairs, ...pairs]);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return;
    }

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const isComplete = matched.length === cards.length && cards.length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {!gameStarted ? (
        <div className="text-center py-12">
          <p className="text-lg mb-8" style={{ color: '#8A8A8A' }}>
            Match the pairs! Test your memory together.
          </p>
          <Button
            data-testid="start-memory-game-btn"
            onClick={initGame}
            className="rounded-full px-12 py-8 text-lg font-bold"
            style={{ background: 'linear-gradient(90deg, #A0C49D 0%, #B8D5B3 100%)' }}
          >
            Start Game
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-bold" style={{ color: '#4A4A4A' }}>Moves: {moves}</p>
            <Button
              data-testid="restart-memory-game-btn"
              onClick={initGame}
              variant="outline"
              className="rounded-full"
            >
              Restart
            </Button>
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary/20 rounded-3xl p-6 mb-6 text-center"
            >
              <p className="text-2xl font-heading font-bold" style={{ color: '#4A4A4A' }}>
                🎉 Completed in {moves} moves!
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-4 gap-4">
            {cards.map((emoji, index) => (
              <motion.button
                key={index}
                data-testid={`memory-card-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(index)}
                className={`aspect-square rounded-2xl text-4xl font-bold transition-all ${
                  flipped.includes(index) || matched.includes(index)
                    ? 'bg-pink-100 border-2 border-pink-300'
                    : 'bg-pink-50 border-2 border-pink-200'
                }`}
              >
                {flipped.includes(index) || matched.includes(index) ? emoji : "?"}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}