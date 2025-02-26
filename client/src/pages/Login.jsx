import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/users/login", {
        name,
        password,
      });
      if (response.data.success) {
        navigate(`/${response.data.userId}`);
        localStorage.setItem("token", response.data.token);
      } else {
        alert("Login failed! Please check your credentials.");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Invitation Code</label>
          <input
            type="text"
            className="w-2/3 p-2 border border-gray-300 rounded mt-1"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 hover:cursor-pointer"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
