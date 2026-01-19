import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TruthOrDare from "@/components/games/TruthOrDare";
import QuestionGame from "@/components/games/QuestionGame";
import MemoryGame from "@/components/games/MemoryGame";
import DrawingBoard from "@/components/games/DrawingBoard";

export default function Games({ roomCode, myName }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Fun Games</h2>

      <Tabs defaultValue="truth" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-pink-50 p-2 rounded-2xl mb-6">
          <TabsTrigger data-testid="game-truth-tab" value="truth" className="rounded-xl">Truth or Dare</TabsTrigger>
          <TabsTrigger data-testid="game-questions-tab" value="questions" className="rounded-xl">Questions</TabsTrigger>
          <TabsTrigger data-testid="game-memory-tab" value="memory" className="rounded-xl">Memory</TabsTrigger>
          <TabsTrigger data-testid="game-draw-tab" value="draw" className="rounded-xl">Drawing</TabsTrigger>
        </TabsList>

        <TabsContent value="truth">
          <TruthOrDare />
        </TabsContent>

        <TabsContent value="questions">
          <QuestionGame />
        </TabsContent>

        <TabsContent value="memory">
          <MemoryGame />
        </TabsContent>

        <TabsContent value="draw">
          <DrawingBoard roomCode={roomCode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}