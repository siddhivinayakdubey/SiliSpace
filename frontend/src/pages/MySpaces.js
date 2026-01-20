import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Plus, LogIn, LogOut, Users } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MySpaces() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/");
      return;
    }

    setUser(JSON.parse(userData));
    await fetchMyRooms(token);
  };

  const fetchMyRooms = async (token) => {
    try {
      const response = await axios.get(`${API}/rooms/my-rooms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
      toast.error("Failed to load your spaces");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (!partnerName.trim()) {
      toast.error("Please enter your display name for this space");
      return;
    }

    const token = localStorage.getItem("token");
    setActionLoading(true);

    try {
      const response = await axios.post(
        `${API}/rooms/create`,
        { partner_name: partnerName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { code } = response.data;
      toast.success(`Space created! Code: ${code}`);
      setShowCreateModal(false);
      setPartnerName("");
      navigate(`/room/${code}`);
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Failed to create space");
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      toast.error("Please enter room code");
      return;
    }

    const token = localStorage.getItem("token");
    setActionLoading(true);

    try {
      await axios.post(
        `${API}/rooms/join`,
        { code: joinCode.trim().toUpperCase() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Joined space successfully!");
      setShowJoinModal(false);
      setJoinCode("");
      navigate(`/room/${joinCode.trim().toUpperCase()}`);
    } catch (error) {
      const errorMsg = error.response?.data?.detail;
      toast.error(typeof errorMsg === 'string' ? errorMsg : "Failed to join space");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF0F3 100%)' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">💕</div>
          <p style={{ color: '#8A8A8A' }}>Loading your spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFF0F3 100%)' }}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold" style={{ color: '#4A4A4A' }}>
              that sili website
            </h1>
            <p className="text-lg mt-2" style={{ color: '#8A8A8A' }}>
              Welcome back, {user?.name}! 💕
            </p>
          </div>
          <Button
            data-testid="logout-btn"
            onClick={handleLogout}
            variant="outline"
            className="rounded-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4 mb-12"
        >
          <Button
            data-testid="create-space-btn"
            onClick={() => setShowCreateModal(true)}
            className="rounded-3xl p-8 h-auto flex items-center justify-center gap-3 text-lg font-bold"
            style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
          >
            <Plus className="w-6 h-6" />
            Create New Space
          </Button>
          
          <Button
            data-testid="join-space-btn"
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="rounded-3xl p-8 h-auto flex items-center justify-center gap-3 text-lg font-bold border-2"
            style={{ borderColor: '#FF8FA3', color: '#FF8FA3' }}
          >
            <LogIn className="w-6 h-6" />
            Join Partner's Space
          </Button>
        </motion.div>

        {/* Rooms List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-heading text-2xl font-bold mb-6" style={{ color: '#4A4A4A' }}>
            Your Spaces
          </h2>

          {rooms.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-pink-200">
              <div className="text-6xl mb-4">💑</div>
              <p className="text-lg mb-2" style={{ color: '#4A4A4A' }}>No spaces yet</p>
              <p style={{ color: '#8A8A8A' }}>Create a new space or join your partner's space to get started!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room, index) => (
                <motion.div
                  key={room.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => navigate(`/room/${room.code}`)}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-pink-100"
                  data-testid={`space-${room.code}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">💕</div>
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: '#FFF0F3', color: '#FF8FA3' }}
                    >
                      {room.code}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" style={{ color: '#A0C49D' }} />
                      <span className="text-sm font-medium" style={{ color: '#4A4A4A' }}>
                        {room.partner1_name}
                        {room.partner2_name && ` & ${room.partner2_name}`}
                      </span>
                    </div>
                    
                    {!room.partner2_name && (
                      <div 
                        className="text-xs px-3 py-2 rounded-xl"
                        style={{ background: '#FFF9F5', color: '#8A8A8A' }}
                      >
                        Waiting for partner to join...
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-pink-100">
                    <p className="text-xs" style={{ color: '#8A8A8A' }}>
                      Created {new Date(room.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Create Space Modal */}
      {showCreateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>
              Create New Space
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8A8A8A' }}>
              Enter your display name for this space. You'll get a unique code to share with your partner!
            </p>
            
            <Input
              data-testid="partner-name-input"
              placeholder="Your display name (e.g., Sweetheart, Babe)"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              className="mb-4 h-12 rounded-2xl"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
            />
            
            <div className="flex gap-2">
              <Button
                data-testid="create-space-submit-btn"
                onClick={handleCreateRoom}
                disabled={actionLoading}
                className="flex-1 rounded-full py-6 font-bold"
                style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
              >
                {actionLoading ? "Creating..." : "Create Space"}
              </Button>
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  setPartnerName("");
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

      {/* Join Space Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowJoinModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-2xl font-bold mb-4" style={{ color: '#4A4A4A' }}>
              Join Partner's Space
            </h3>
            <p className="text-sm mb-6" style={{ color: '#8A8A8A' }}>
              Enter the 6-digit code your partner shared with you.
            </p>
            
            <Input
              data-testid="join-code-input-modal"
              placeholder="Room code (e.g., ABC123)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="mb-4 h-12 rounded-2xl text-center text-xl font-bold tracking-wider"
              maxLength={6}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
            />
            
            <div className="flex gap-2">
              <Button
                data-testid="join-space-submit-btn"
                onClick={handleJoinRoom}
                disabled={actionLoading}
                className="flex-1 rounded-full py-6 font-bold"
                style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
              >
                {actionLoading ? "Joining..." : "Join Space"}
              </Button>
              <Button
                onClick={() => {
                  setShowJoinModal(false);
                  setJoinCode("");
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
    </div>
  );
}
