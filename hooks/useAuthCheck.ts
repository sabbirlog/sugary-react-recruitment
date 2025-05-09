"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const useAuthCheck = () => {
  const { data: session, status } = useSession();
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");

  const checkAuth = useCallback(() => {
    if (status === "loading") {
      setAuthStatus("loading");
    } else if (session?.user?.accessToken) {
      setAuthStatus("authenticated");
    } else {
      setAuthStatus("unauthenticated");
    }
  }, [session, status]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return authStatus !== "loading" && authStatus;
};

export default useAuthCheck;