import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const TRUTH_QUESTIONS = [
  "What's your favorite memory of us together?",
  "What's one thing you've never told me?",
  "What do you miss most about me right now?",
  "What was your first impression of me?",
  "What's your favorite thing about our relationship?",
  "If you could relive one day with me, which would it be?",
  "What's something you want us to do together in the future?",
  "What song reminds you of me?",
  "What's your favorite photo of us?",
  "When did you realize you loved me?"
];

const DARE_CHALLENGES = [
  "Send me a voice message singing our song",
  "Share your screen and show me your camera roll",
  "Write me a poem right now",
  "Do a silly dance on video call",
  "Send me 10 reasons why you love me",
  "Change your profile picture to a photo of us",
  "Call me and say 'I love you' in 3 different languages",
  "Send me a video of you doing your best animal impression",
  "Write 'I love [partner name]' on your hand and send a photo",
  "Plan our next date and send me the details"
];

export default function TruthOrDare() {
  const [mode, setMode] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const getRandomPrompt = (type) => {
    setMode(type);
    const prompts = type === "truth" ? TRUTH_QUESTIONS : DARE_CHALLENGES;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!mode ? (
        <div className="text-center py-12">
          <p className="text-lg mb-8" style={{ color: '#8A8A8A' }}>Choose your challenge!</p>
          <div className="flex gap-4 justify-center">
            <Button
              data-testid="truth-btn"
              onClick={() => getRandomPrompt("truth")}
              className="rounded-full px-12 py-8 text-lg font-bold"
              style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
            >
              Truth
            </Button>
            <Button
              data-testid="dare-btn"
              onClick={() => getRandomPrompt("dare")}
              className="rounded-full px-12 py-8 text-lg font-bold"
              style={{ background: 'linear-gradient(90deg, #A0C49D 0%, #B8D5B3 100%)' }}
            >
              Dare
            </Button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div
            className="inline-block px-6 py-3 rounded-full mb-6 font-bold text-white"
            style={{ background: mode === "truth" ? '#FF8FA3' : '#A0C49D' }}
          >
            {mode === "truth" ? "TRUTH" : "DARE"}
          </div>
          <div
            data-testid="truth-dare-prompt"
            className="bg-pink-50 rounded-3xl p-8 mb-6 border-2 border-pink-200"
          >
            <p className="text-xl md:text-2xl font-heading font-bold" style={{ color: '#4A4A4A' }}>
              {currentPrompt}
            </p>
          </div>
          <Button
            data-testid="next-challenge-btn"
            onClick={() => getRandomPrompt(mode)}
            variant="outline"
            className="rounded-full px-8 py-6 mr-4"
          >
            Next Challenge
          </Button>
          <Button
            data-testid="back-to-choice-btn"
            onClick={() => {
              setMode(null);
              setCurrentPrompt("");
            }}
            variant="outline"
            className="rounded-full px-8 py-6"
          >
            Back
          </Button>
        </motion.div>
      )}
    </div>
  );
}