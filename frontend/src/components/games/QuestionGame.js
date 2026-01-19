import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const QUESTIONS = [
  "If we could live anywhere in the world, where would you choose?",
  "What's your idea of a perfect date night?",
  "What's one goal you want us to achieve together?",
  "How do you think we've grown as a couple?",
  "What's your love language?",
  "What do you think makes our relationship special?",
  "If you could describe our relationship in three words, what would they be?",
  "What's something you'd like to learn together?",
  "What's your favorite thing I do for you?",
  "How do you see our future together?",
  "What's one thing you admire about me?",
  "What's your favorite season and why?",
  "If we had a whole day together, how would you want to spend it?",
  "What's a dream you have that you haven't shared with me yet?",
  "What makes you feel most loved by me?"
];

export default function QuestionGame() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [askedQuestions, setAskedQuestions] = useState([]);

  const getRandomQuestion = () => {
    const availableQuestions = QUESTIONS.filter(q => !askedQuestions.includes(q));
    
    if (availableQuestions.length === 0) {
      setAskedQuestions([]);
      return;
    }
    
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setCurrentQuestion(randomQuestion);
    setAskedQuestions([...askedQuestions, randomQuestion]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!currentQuestion ? (
        <div className="text-center py-12">
          <p className="text-lg mb-8" style={{ color: '#8A8A8A' }}>
            Get to know each other better with deep questions!
          </p>
          <Button
            data-testid="start-questions-btn"
            onClick={getRandomQuestion}
            className="rounded-full px-12 py-8 text-lg font-bold"
            style={{ background: 'linear-gradient(90deg, #FFD166 0%, #FFE29B 100%)' }}
          >
            Start Questions
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div
            data-testid="question-prompt"
            className="bg-yellow-50 rounded-3xl p-8 mb-6 border-2 border-yellow-200"
          >
            <p className="text-xl md:text-2xl font-heading font-bold" style={{ color: '#4A4A4A' }}>
              {currentQuestion}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              data-testid="next-question-btn"
              onClick={getRandomQuestion}
              className="rounded-full px-8 py-6"
              style={{ background: 'linear-gradient(90deg, #FFD166 0%, #FFE29B 100%)' }}
            >
              {askedQuestions.length >= QUESTIONS.length ? "Restart" : "Next Question"}
            </Button>
          </div>
          <p className="mt-4 text-sm" style={{ color: '#8A8A8A' }}>
            {askedQuestions.length} / {QUESTIONS.length} questions
          </p>
        </motion.div>
      )}
    </div>
  );
}