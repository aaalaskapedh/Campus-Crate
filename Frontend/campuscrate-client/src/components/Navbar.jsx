import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-semibold text-xl tracking-tight">
            CampusCrate
          </span>
        </Link>

        {user && (
          <nav className="flex items-center gap-5 font-mono text-xs uppercase tracking-wide">
            <Link to="/" className="text-ink-soft hover:text-ink transition-colors">
              Browse
            </Link>
            <Link
              to="/post"
              className="text-ink-soft hover:text-ink transition-colors"
            >
              Post item
            </Link>
            {user.role === "admin" && (
              <Link
                to="/admin"
                className="text-ink-soft hover:text-ink transition-colors"
              >
                Admin
              </Link>
            )}
            <div className="flex items-center gap-2 pl-3 border-l border-line">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
              )}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="text-ink-soft hover:text-lost transition-colors normal-case font-body"
              >
                Sign out
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
