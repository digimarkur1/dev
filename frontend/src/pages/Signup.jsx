import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", id: "", password: "", role: "user" });
  const navigate = useNavigate();

  const handleSignup = async () => {
    await API.post("/signup", form);
    navigate("/");
  };

return (
    <div className="container">
      <h2>Signup</h2>

      <input placeholder="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="id" onChange={(e) => setForm({ ...form, id: e.target.value })} />
      <input placeholder="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button onClick={handleSignup}>Signup</button>
    </div>
  );

}