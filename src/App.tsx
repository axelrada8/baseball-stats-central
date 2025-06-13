
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import BaseballLanding from '@/pages/baseball-landing';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<BaseballLanding />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
