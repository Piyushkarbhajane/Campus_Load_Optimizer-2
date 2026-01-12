import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error || !data.session) {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return <p>Signing you in…</p>;
}
