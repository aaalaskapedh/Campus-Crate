import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if we have a saved token and, if so,
  // verify it's still valid by asking the backend who we are.
  useEffect(() => {
    const token = localStorage.getItem("campuscrate_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("campuscrate_token"))
      .finally(() => setLoading(false));
  }, []);

  async function loginWithGoogle(credential) {
    const res = await api.post("/auth/google", { credential });
    localStorage.setItem("campuscrate_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem("campuscrate_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
