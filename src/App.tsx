import "tailwindcss";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CarPricePredictor from "./components/CarPricePredictor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CarPricePredictor />} />
        
        <Route path="*" element={<CarPricePredictor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;