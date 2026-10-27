import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useAdmin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let checkId = 0;

    const checkRole = async (u: User | null) => {
      const id = ++checkId;
      if (!u) {
        if (!active) return;
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
        if (!active || id !== checkId) return;
        if (error) throw error;
        setUser(u);
        setIsAdmin(!!data?.some(r => r.role === "admin"));
      } catch {
        if (!active || id !== checkId) return;
        setUser(null);
        setIsAdmin(false);
      } finally {
        if (active && id === checkId) setLoading(false);
      }
    };

    // Never await Supabase calls inside onAuthStateChange (causes auth deadlock / freezes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => checkRole(session?.user ?? null), 0);
    });

    supabase.auth.getSession()
      .then(({ data: { session } }) => checkRole(session?.user ?? null))
      .catch(() => checkRole(null));

    // Safety net: if nothing resolves, send to login instead of hanging
    const timeout = setTimeout(() => {
      if (active) setLoading(l => { if (l) { setUser(null); setIsAdmin(false); } return false; });
    }, 8000);

    return () => {
      active = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
};
