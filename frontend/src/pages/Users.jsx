import { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    await API.delete("/logout", {
      data: { token: refreshToken },
    });

    localStorage.clear();
    navigate("/");
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

return (
<div className="container">
  <div className="header">
    <h2>Users</h2>
    <button onClick={handleLogout}>Logout</button>
  </div>

  <input
    placeholder="Search user"
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="user-list">
    {filteredUsers.map((u) => (
      <div className="user-item" key={u._id}>
        {u.name}
      </div>
    ))}
  </div>
</div>
);
}