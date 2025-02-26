import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Group from "./pages/Group";
import Login from "./pages/Login";
function App() {
  return (
    <div className="bg-black h-full w-full">
      <Router>
        <Routes>
          <Route path="/:id" element={<Dashboard />} />
          <Route path="/group/:id" element={<Group />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
