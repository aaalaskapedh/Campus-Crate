import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLost from "./pages/DashboardLost";
import DashboardFound from "./pages/DashboardFound";
import PostLost from "./pages/PostLost";
import PostFound from "./pages/PostFound";
import ItemDetail from "./pages/ItemDetail";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/lost" element={<ProtectedRoute><DashboardLost /></ProtectedRoute>} />
        <Route path="/dashboard/found" element={<ProtectedRoute><DashboardFound /></ProtectedRoute>} />
        <Route path="/post-lost" element={<ProtectedRoute><PostLost /></ProtectedRoute>} />
        <Route path="/post-found" element={<ProtectedRoute><PostFound /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ProtectedRoute><ItemDetail /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}