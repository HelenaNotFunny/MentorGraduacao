import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Courses } from "./pages/Courses";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Flowchart } from "./pages/Flowchart";
import { SubjectCreate } from "./pages/SubjectCreate";
import { SubjectDetail } from "./pages/SubjectDetail";
import { Subjects } from "./pages/Subjects";
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
        <Route path="/flowchart" element={<ProtectedRoute><Flowchart /></ProtectedRoute>} />
        <Route path="/flowchart/:courseId" element={<ProtectedRoute><Flowchart /></ProtectedRoute>} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/subjects/new" element={<SubjectCreate />} />
        <Route path="/subjects/:id" element={<SubjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
