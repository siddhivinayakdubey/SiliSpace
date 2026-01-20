import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CountdownTimer({ roomCode }) {
  const [countdown, setCountdown] = useState(null);
  const [eventName, setEventName] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [editing, setEditing] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCountdown();
  }, [roomCode]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (countdown?.target_date) {
      const timer = setInterval(() => {
        calculateTimeLeft();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const fetchCountdown = async () => {
    try {
      const response = await axios.get(`${API}/countdown/${roomCode}`);
      if (response.data) {
        setCountdown(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch countdown", error);
    }
  };

  const calculateTimeLeft = () => {
    if (!countdown?.target_date) return;
    
    const difference = new Date(countdown.target_date) - new Date();
    
    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    } else {
      setTimeLeft({ expired: true });
    }
  };

  const saveCountdown = async () => {
    if (!eventName.trim() || !targetDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await axios.post(`${API}/countdown/set`, {
        room_code: roomCode,
        event_name: eventName.trim(),
        target_date: new Date(targetDate).toISOString()
      });

      toast.success("Countdown set!");
      setEditing(false);
      fetchCountdown();
    } catch (error) {
      toast.error("Failed to set countdown");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <h2 className="font-heading text-3xl font-bold mb-6" style={{ color: '#4A4A4A' }}>Countdown Timer</h2>

      {!countdown || editing ? (
        <div className="max-w-md mx-auto">
          <Input
            data-testid="countdown-event-input"
            placeholder="Event name (e.g., Our Next Meeting)"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="mb-4 h-12 rounded-2xl"
          />
          <Input
            data-testid="countdown-date-input"
            type="datetime-local"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mb-4 h-12 rounded-2xl"
          />
          <div className="flex gap-2">
            <Button
              data-testid="save-countdown-btn"
              onClick={saveCountdown}
              className="flex-1 rounded-full py-6 font-bold"
              style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
            >
              Set Countdown
            </Button>
            {countdown && (
              <Button
                data-testid="cancel-edit-countdown-btn"
                onClick={() => setEditing(false)}
                variant="outline"
                className="rounded-full px-6"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mb-8">
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4" style={{ color: '#4A4A4A' }}>
              {countdown.event_name}
            </h3>
            
            {timeLeft.expired ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : (
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                <TimeBox label="Days" value={timeLeft.days || 0} />
                <TimeBox label="Hours" value={timeLeft.hours || 0} />
                <TimeBox label="Minutes" value={timeLeft.minutes || 0} />
                <TimeBox label="Seconds" value={timeLeft.seconds || 0} />
              </div>
            )}

            {timeLeft.expired && (
              <p className="text-2xl font-heading font-bold mb-4" style={{ color: '#FF8FA3' }}>
                The day has arrived!
              </p>
            )}
          </div>

          <Button
            data-testid="edit-countdown-btn"
            onClick={() => {
              setEventName(countdown.event_name);
              setTargetDate(new Date(countdown.target_date).toISOString().slice(0, 16));
              setEditing(true);
            }}
            variant="outline"
            className="rounded-full px-8 py-4"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Edit Countdown
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function TimeBox({ label, value }) {
  return (
    <div className="bg-pink-50 rounded-2xl p-4 border-2 border-pink-200">
      <div className="text-3xl md:text-4xl font-heading font-bold mb-2" style={{ color: '#FF8FA3' }}>
        {value}
      </div>
      <div className="text-sm font-medium" style={{ color: '#8A8A8A' }}>
        {label}
      </div>
    </div>
  );
}