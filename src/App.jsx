import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/dashboard" element={<DashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
