import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Download } from "lucide-react";
import "@/App.css";

const COLORS = [
  { name: "Pink", color: "#FF8FA3" },
  { name: "Green", color: "#A0C49D" },
  { name: "Yellow", color: "#FFD166" },
  { name: "Purple", color: "#B19CD9" },
  { name: "Black", color: "#4A4A4A" },
];

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0].color);
  const [brushSize, setBrushSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "our-drawing.png";
    link.href = url;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex flex-wrap gap-4 items-center mb-4">
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c.color}
                data-testid={`color-${c.name.toLowerCase()}`}
                onClick={() => setCurrentColor(c.color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  currentColor === c.color ? 'border-black scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.name}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Paintbrush className="w-4 h-4" style={{ color: '#8A8A8A' }} />
            <input
              data-testid="brush-size-slider"
              type="range"
              min="1"
              max="10"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
            <span className="text-sm" style={{ color: '#8A8A8A' }}>{brushSize}px</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            data-testid="clear-canvas-btn"
            onClick={clearCanvas}
            variant="outline"
            className="rounded-full"
            size="sm"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button
            data-testid="download-drawing-btn"
            onClick={downloadDrawing}
            variant="outline"
            className="rounded-full"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        data-testid="drawing-canvas"
        width={800}
        height={600}
        className="w-full border-2 border-pink-200 rounded-3xl bg-white drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <p className="text-sm text-center mt-4" style={{ color: '#8A8A8A' }}>
        Draw something special together! You can share your screen to draw together in real-time.
      </p>
    </div>
  );
}