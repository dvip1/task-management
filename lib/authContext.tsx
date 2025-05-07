"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import Routes from "@/data/routes";

// Define your User type (ensure it matches what your API returns for user info)
type User = {
  id: string;
  username: string;
  email: string;
  // Add other relevant user fields
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Indicates if initial auth check is in progress
  loginContext: (user: User) => void; // Renamed for clarity, will be exposed as 'login'
  logoutContext: () => Promise<void>; // Renamed, will be exposed as 'logout'
  checkAuthStatus: () => Promise<void>; // To explicitly re-check auth status
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start true until initial check completes

  const checkAuthStatus = useCallback(async (isInitialLoad = false) => {
    if (!isInitialLoad) {
      // Don't show loading spinner for background checks unless it's the very first one
      setIsLoading(true);
    }
    console.log("AuthContext: Checking authentication status...");
    try {
      // This endpoint should rely on your HTTP-only cookie
      const response = await fetch(Routes.me); // Or your session check endpoint

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          console.log(
            "AuthContext: User authenticated via session:",
            data.user,
          );
        } else {
          // This means /api/me responded OK but didn't provide user data.
          // Could be an issue with API response structure.
          setUser(null);
          console.warn("AuthContext: /api/me OK but no user data in response.");
        }
      } else {
        // Common cases: 401 (unauthorized), 403 (forbidden)
        setUser(null);
        if (response.status !== 401) {
          // Don't flood console for expected "not logged in"
          console.log(
            `AuthContext: User not authenticated (status: ${response.status})`,
          );
        }
      }
    } catch (error) {
      console.error("AuthContext: Error during auth status check:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log(
        "AuthContext: Auth status check complete. isLoading:",
        false,
        "User is now:",
        user,
      );
    }
  }, []); // Removed `user` from dependencies as it caused re-runs; checkAuthStatus should be stable.

  // Initial authentication check on component mount
  useEffect(() => {
    checkAuthStatus(true); // Pass true for initial load
  }, [checkAuthStatus]);

  // This function is called by your Login component AFTER a successful API login
  // The API itself handles setting the cookie. This just updates client state.
  const loginContext = (loggedInUser: User) => {
    console.log("AuthContext: loginContext called with user:", loggedInUser);
    setUser(loggedInUser);
    // No client-side token storage needed here!
  };

  const logoutContext = async () => {
    console.log("AuthContext: logoutContext called");
    setIsLoading(true); // Optional: show loading during logout API call
    try {
      // Call the backend to invalidate the session and clear the HTTP-only cookie
      const response = await fetch(Routes.logout, { method: "POST" }); // Or GET, depends on your API
      if (!response.ok) {
        // Log error but proceed to clear client state
        console.error("AuthContext: API logout failed.", await response.text());
      } else {
        console.log("AuthContext: API logout successful.");
      }
    } catch (error) {
      console.error("AuthContext: Error during API logout:", error);
    } finally {
      setUser(null);
      setIsLoading(false); // Done with logout process
      console.log("AuthContext: Client-side user state cleared.");
      // Optionally, you might want to redirect here or let consuming components handle it.
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // True if user object exists
        isLoading,
        loginContext, // Will be used as `login` by consumers
        logoutContext, // Will be used as `logout` by consumers
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  // Map internal names to simpler ones for consumers
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    login: context.loginContext,
    logout: context.logoutContext,
    checkAuthStatus: context.checkAuthStatus,
  };
}
