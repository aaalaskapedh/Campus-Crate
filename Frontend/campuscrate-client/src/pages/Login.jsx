import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleSuccess(credentialResponse) {
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError("Couldn't sign you in. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft mb-3">
            Campus lost &amp; found
          </p>
          <h1 className="font-display font-semibold text-4xl tracking-tight">
            CampusCrate
          </h1>
          <p className="text-ink-soft mt-3">
            Lost something on campus? Found something? Hand it in here.
          </p>
        </div>

        <div className="ticket p-6 flex flex-col items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
            Sign in with your college email
          </span>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError("Google sign-in failed.")}
          />
          {error && (
            <p className="text-lost text-sm font-mono">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
