import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Gamepad2, Calendar, ListChecks } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LandingPage() {
  const navigate = useNavigate();
  const [showJoin, setShowJoin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [createName, setCreateName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRoom = async () => {
    if (!createName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/rooms/create`, {
        partner_name: createName.trim()
      });

      const { code } = response.data;
      localStorage.setItem(`room_${code}_name`, createName.trim());
      toast.success(`Room created! Code: ${code}`);
      navigate(`/room/${code}`);
    } catch (error) {
      toast.error("Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim() || !joinName.trim()) {
      toast.error("Please enter both room code and your name");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/rooms/join`, {
        code: joinCode.trim().toUpperCase(),
        partner_name: joinName.trim()
      });

      localStorage.setItem(`room_${joinCode.trim().toUpperCase()}_name`, joinName.trim());
      toast.success("Joined room successfully!");
      navigate(`/room/${joinCode.trim().toUpperCase()}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF0F3 100%)' }}>
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-6xl" style={{ color: '#FF8FA3' }}>❤️</div>
        <div className="absolute top-40 right-20 text-4xl" style={{ color: '#A0C49D' }}>💕</div>
        <div className="absolute bottom-40 left-1/4 text-5xl" style={{ color: '#FFD166' }}>💝</div>
        <div className="absolute bottom-20 right-1/3 text-6xl" style={{ color: '#FF8FA3' }}>💖</div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="font-heading text-5xl md:text-7xl tracking-tight font-extrabold mb-6" style={{ color: '#4A4A4A' }}>
            Distance Doesn't <br />
            <span style={{ color: '#FF8FA3' }}>Matter</span> Anymore
          </h1>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: '#8A8A8A' }}>
            Stay connected with your loved one through virtual flowers, sweet messages, fun games, and shared moments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              data-testid="create-room-btn"
              onClick={() => setShowCreate(true)}
              className="rounded-full px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Create Your Space
            </Button>
            <Button
              data-testid="join-room-btn"
              onClick={() => setShowJoin(true)}
              variant="outline"
              className="rounded-full px-8 py-6 font-bold transition-all duration-300 text-lg border-2"
              style={{ borderColor: '#FF8FA3', color: '#FF8FA3' }}
            >
              Join Partner
            </Button>
          </div>
        </motion.div>

        {/* Create Room Modal */}
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Create Your Space</h2>
              <Input
                data-testid="create-name-input"
                placeholder="Your name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="mb-4 h-12 rounded-2xl"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
              />
              <Button
                data-testid="create-room-submit-btn"
                onClick={handleCreateRoom}
                disabled={loading}
                className="w-full rounded-full py-6 font-bold"
                style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
              >
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Join Room Modal */}
        {showJoin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowJoin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Join Your Partner</h2>
              <Input
                data-testid="join-code-input"
                placeholder="Room code (e.g., ABC123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="mb-4 h-12 rounded-2xl"
              />
              <Input
                data-testid="join-name-input"
                placeholder="Your name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                className="mb-4 h-12 rounded-2xl"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
              />
              <Button
                data-testid="join-room-submit-btn"
                onClick={handleJoinRoom}
                disabled={loading}
                className="w-full rounded-full py-6 font-bold"
                style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
              >
                {loading ? "Joining..." : "Join Room"}
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          <FeatureCard
            icon={<Heart className="w-8 h-8" />}
            title="Virtual Garden"
            description="Send beautiful flowers with heartfelt messages"
            color="#FF8FA3"
          />
          <FeatureCard
            icon={<MessageCircle className="w-8 h-8" />}
            title="Love Notes"
            description="Share sweet messages anytime, anywhere"
            color="#A0C49D"
          />
          <FeatureCard
            icon={<Gamepad2 className="w-8 h-8" />}
            title="Fun Games"
            description="Play together with Truth or Dare, Memory, Drawing"
            color="#FFD166"
          />
          <FeatureCard
            icon={<Calendar className="w-8 h-8" />}
            title="Countdown Timer"
            description="Count down to your next meetup"
            color="#FF8FA3"
          />
          <FeatureCard
            icon={<ListChecks className="w-8 h-8" />}
            title="Bucket List"
            description="Plan your dreams together"
            color="#A0C49D"
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8" />}
            title="Virtual Hugs"
            description="Send warm hugs across the distance"
            color="#FFD166"
          />
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100"
    >
      <div className="mb-4" style={{ color }}>
        {icon}
      </div>
      <h3 className="font-heading text-2xl font-bold mb-2" style={{ color: '#4A4A4A' }}>{title}</h3>
      <p className="text-base leading-relaxed" style={{ color: '#8A8A8A' }}>{description}</p>
    </motion.div>
  );
}