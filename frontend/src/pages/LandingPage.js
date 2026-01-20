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
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  
  // Auth fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    if (!isLogin && !name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { email: email.trim(), password }
        : { email: email.trim(), password, name: name.trim() };
      
      const response = await axios.post(`${API}${endpoint}`, payload);
      const { access_token, user } = response.data;
      
      // Store token and user
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      
      toast.success(isLogin ? "Logged in successfully!" : "Account created!");
      
      // Navigate to My Spaces
      navigate("/spaces");
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      if (typeof errorMsg === 'string') {
        toast.error(errorMsg);
      } else if (Array.isArray(errorMsg)) {
        toast.error(errorMsg[0]?.msg || "An error occurred");
      } else {
        toast.error(`Failed to ${isLogin ? 'login' : 'register'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const checkExistingRoom = async (token) => {
    try {
      // Try to create room (it will return existing if user has one)
      const response = await axios.post(
        `${API}/rooms/create`,
        { partner_name: name.trim() || "User" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { code, existing } = response.data;
      if (existing) {
        toast.success("Welcome back! Rejoining your room...");
      }
      navigate(`/room/${code}`);
    } catch (error) {
      // If failed, show join option
      setShowAuth(false);
      setShowJoin(true);
    }
  };

  const createRoom = async (token, userName) => {
    try {
      const response = await axios.post(
        `${API}/rooms/create`,
        { partner_name: userName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { code } = response.data;
      toast.success(`Room created! Code: ${code}`);
      navigate(`/room/${code}`);
    } catch (error) {
      toast.error("Failed to create room");
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter room code");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      setShowJoin(false);
      setShowAuth(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API}/rooms/join`,
        { code: joinCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
              data-testid="get-started-btn"
              onClick={() => {
                setIsLogin(false);
                setShowAuth(true);
              }}
              className="rounded-full px-8 py-6 font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
              style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
            >
              <Heart className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button
              data-testid="login-btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuth(true);
              }}
              variant="outline"
              className="rounded-full px-8 py-6 font-bold transition-all duration-300 text-lg border-2"
              style={{ borderColor: '#FF8FA3', color: '#FF8FA3' }}
            >
              Login
            </Button>
          </div>
        </motion.div>

        {/* Auth Modal */}
        {showAuth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuth(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              
              <Input
                data-testid="auth-email-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 h-12 rounded-2xl"
              />
              
              {!isLogin && (
                <Input
                  data-testid="auth-name-input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4 h-12 rounded-2xl"
                />
              )}
              
              <Input
                data-testid="auth-password-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 h-12 rounded-2xl"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
              
              <Button
                data-testid="auth-submit-btn"
                onClick={handleAuth}
                disabled={loading}
                className="w-full rounded-full py-6 font-bold mb-4"
                style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
              >
                {loading ? "Please wait..." : (isLogin ? "Login" : "Create Account & Start")}
              </Button>
              
              <button
                data-testid="toggle-auth-mode-btn"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm w-full text-center"
                style={{ color: '#FF8FA3' }}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
              </button>
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
            title="Valentine Cards"
            description="Send adorable valentine cards"
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