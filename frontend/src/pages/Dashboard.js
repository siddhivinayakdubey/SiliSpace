import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Gamepad2, Calendar, ListChecks, Copy, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import VirtualGarden from "@/components/VirtualGarden";
import LoveNotes from "@/components/LoveNotes";
import Games from "@/components/Games";
import CountdownTimer from "@/components/CountdownTimer";
import BucketListComponent from "@/components/BucketListComponent";
import VirtualHugs from "@/components/VirtualHugs";
import ValentineCards from "@/components/ValentineCards";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const { code } = useParams();
  const [room, setRoom] = useState(null);
  const [myName, setMyName] = useState("");
  const [activeTab, setActiveTab] = useState("garden");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      toast.error("Please login first");
      window.location.href = "/";
      return;
    }
    
    const userData = JSON.parse(user);
    setMyName(userData.name);
    
    fetchRoom();
  }, [code]);

  const fetchRoom = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/rooms/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoom(response.data);
    } catch (error) {
      toast.error("Room not found");
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success("Room code copied!");
  };

  const partnerName = room?.partner1_name === myName ? room?.partner2_name : room?.partner1_name;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF0F3 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: '#4A4A4A' }}>
            Sili Space
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-lg" style={{ color: '#8A8A8A' }}>
              Room: <strong className="font-heading" style={{ color: '#FF8FA3' }}>{code}</strong>
            </span>
            <Button
              data-testid="copy-code-btn"
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="rounded-full"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          {partnerName && (
            <p className="text-base" style={{ color: '#8A8A8A' }}>
              Connected with <strong style={{ color: '#FF8FA3' }}>{partnerName}</strong> ❤️
            </p>
          )}
          {!partnerName && (
            <p className="text-base" style={{ color: '#8A8A8A' }}>
              Share the code with your partner to connect!
            </p>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-2 bg-white/50 p-2 rounded-3xl mb-8">
            <TabsTrigger data-testid="tab-garden" value="garden" className="rounded-full flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Garden</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-notes" value="notes" className="rounded-full flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-valentine" value="valentine" className="rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Valentine</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-games" value="games" className="rounded-full flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-countdown" value="countdown" className="rounded-full flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Timer</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-bucket" value="bucket" className="rounded-full flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              <span className="hidden sm:inline">Bucket</span>
            </TabsTrigger>
            <TabsTrigger data-testid="tab-hugs" value="hugs" className="rounded-full flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Hugs</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="garden">
                <VirtualGarden roomCode={code} myName={myName} />
              </TabsContent>

              <TabsContent value="notes">
                <LoveNotes roomCode={code} myName={myName} />
              </TabsContent>

              <TabsContent value="valentine">
                <ValentineCards roomCode={code} myName={myName} />
              </TabsContent>

              <TabsContent value="games">
                <Games roomCode={code} myName={myName} />
              </TabsContent>

              <TabsContent value="countdown">
                <CountdownTimer roomCode={code} />
              </TabsContent>

              <TabsContent value="bucket">
                <BucketListComponent roomCode={code} />
              </TabsContent>

              <TabsContent value="hugs">
                <VirtualHugs roomCode={code} myName={myName} />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}