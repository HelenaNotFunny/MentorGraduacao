import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Courses } from "./pages/Courses";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { auth, User } from "./services/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (auth.isAuthenticated()) {
      auth.me().then(setUser).catch(() => auth.logout());
    }
  }, []);

  return (
    <BrowserRouter>
      <Header user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => auth.me().then(setUser)} />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </BrowserRouter>
  );
}
