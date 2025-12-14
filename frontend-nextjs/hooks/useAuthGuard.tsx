"use client";

import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function useAuthGuard() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const demoMode = localStorage.getItem("splitimize_demo") === "true";
    setIsDemoMode(demoMode);
    if (!isPending && !session && !demoMode) {
      console.log("isPending:", isPending, "session:", session);
      setShowAuthModal(true);
    }
  }, [isPending, session]);

  const requireAuth = (callback: () => void) => {
    if (isPending) {
      return; // Prevent action while session is loading. Let calling component handle loading state.
    }
    // Allow if demo mode or authenticated
    if (isDemoMode || session) {
      callback();
      return;
    }
    setShowAuthModal(true);
  };

  return {
    isPending,
    showAuthModal,
    setShowAuthModal,
    requireAuth,
    isDemoMode,
  };
}
