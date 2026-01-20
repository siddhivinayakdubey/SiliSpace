import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import MySpaces from "@/pages/MySpaces";
import Dashboard from "@/pages/Dashboard";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/spaces" element={<MySpaces />} />
          <Route path="/room/:code" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;