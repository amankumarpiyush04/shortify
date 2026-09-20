import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import MouseGrid from "./components/MouseGrid";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import ApiDocs from "./pages/ApiDocs";
import MyLinks from "./pages/MyLinks";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="relative min-h-screen overflow-hidden bg-[#09090b] text-zinc-100">
          <MouseGrid />
          <div className="relative z-10">
            <Navbar />
            

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/api" element={<ApiDocs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/links" element={<MyLinks />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;