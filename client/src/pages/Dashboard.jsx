import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiUserPlus } from "react-icons/fi";

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const groups2 = [
    {
      id: 1,
      name: "Abhinav",
      amount: 766,
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "aman",
      amount: 566,
      updatedAt: new Date(),
    },
    {
      id: 3,
      name: "akash",
      amount: 866,
      updatedAt: new Date(),
    },
  ];
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          "https://your-api-endpoint.com/groups"
        );
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups", error);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups2.map((group) => (
          <div key={group.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p className="text-gray-600">
              Updated at: {new Date(group.updatedAt).toLocaleString()}
            </p>
            <p className="text-gray-800 font-bold">Amount: ${group.amount}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600"
        >
          <FiPlus size={24} />
        </button>
        <button
          type="button"
          className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600"
        >
          <FiUserPlus size={24} />
        </button>
      </div>
    </div>
  );
}
