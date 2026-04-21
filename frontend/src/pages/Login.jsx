import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await API.post("/login", { name, password });

    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    navigate("/users");
  };

return (
  <div className="container">
    <h2>Login</h2>

    <input onChange={(e) => setName(e.target.value)} placeholder="name" />
    <input onChange={(e) => setPassword(e.target.value)} placeholder="password" />

    <button onClick={handleLogin}>Login</button>
  </div>
);
}