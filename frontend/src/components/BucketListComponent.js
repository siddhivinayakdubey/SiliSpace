import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BucketListComponent({ roomCode }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBucketList();
  }, [roomCode]);

  const fetchBucketList = async () => {
    try {
      const response = await axios.get(`${API}/bucketlist/${roomCode}`);
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch bucket list", error);
    }
  };

  const updateBucketList = async (updatedItems) => {
    setLoading(true);
    try {
      await axios.post(`${API}/bucketlist/update`, {
        room_code: roomCode,
        items: updatedItems
      });
      setItems(updatedItems);
    } catch (error) {
      toast.error("Failed to update bucket list");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    if (!newItem.trim()) {
      toast.error("Please enter an item");
      return;
    }

    const updatedItems = [...items, { text: newItem.trim(), completed: false }];
    updateBucketList(updatedItems);
    setNewItem("");
    toast.success("Item added!");
  };

  const toggleItem = (index) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, completed: !item.completed } : item
    );
    updateBucketList(updatedItems);
  };

  const deleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    updateBucketList(updatedItems);
    toast.success("Item deleted");
  };

  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-3xl font-bold" style={{ color: '#4A4A4A' }}>Our Bucket List</h2>
        {items.length > 0 && (
          <div className="text-sm" style={{ color: '#8A8A8A' }}>
            {completedCount} / {items.length} completed
          </div>
        )}
      </div>

      {/* Add Item */}
      <div className="flex gap-2 mb-6">
        <Input
          data-testid="bucket-list-input"
          placeholder="Add a dream or goal..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="flex-1 h-12 rounded-2xl"
        />
        <Button
          data-testid="add-bucket-item-btn"
          onClick={addItem}
          disabled={loading}
          className="rounded-full px-6"
          style={{ background: 'linear-gradient(90deg, #FF8FA3 0%, #FFB3C1 100%)' }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <p className="text-center py-8" style={{ color: '#8A8A8A' }}>
          Start adding dreams and goals you want to achieve together!
        </p>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl border border-pink-100"
                data-testid={`bucket-item-${index}`}
              >
                <Checkbox
                  data-testid={`bucket-checkbox-${index}`}
                  checked={item.completed}
                  onCheckedChange={() => toggleItem(index)}
                  className="rounded-full"
                />
                <span
                  className={`flex-1 text-base ${
                    item.completed ? 'line-through opacity-60' : ''
                  }`}
                  style={{ color: '#4A4A4A' }}
                >
                  {item.text}
                </span>
                <Button
                  data-testid={`delete-bucket-item-${index}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem(index)}
                  className="rounded-full"
                >
                  <Trash2 className="w-4 h-4" style={{ color: '#FF8FA3' }} />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {completedCount === items.length && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-center bg-secondary/20 rounded-3xl p-6"
        >
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-heading text-xl font-bold" style={{ color: '#4A4A4A' }}>
            All dreams completed! Add more goals to achieve together!
          </p>
        </motion.div>
      )}
    </div>
  );
}