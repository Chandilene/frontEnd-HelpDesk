import { createContext, useEffect, type ReactNode } from "react";
import { useState } from "react";
import { api } from "../services/api";
// import { api } from "../services/api";

type AuthContext = {
  isLoading: boolean;
  session: null | UserAPIResponse;
  save: (data: UserAPIResponse) => void;
  remove: () => void;
  updateProfile: (data: { user: User }) => void;
};

const LOCAL_STORAGE_KEY = "@helpdesk";

export const AuthContext = createContext({} as AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | UserAPIResponse>(null);
  const [isLoading, setIsLoading] = useState(true);

  function save(data: UserAPIResponse) {
    localStorage.setItem(
      `${LOCAL_STORAGE_KEY}:user`,
      JSON.stringify(data.user),
    );

    localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token);

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    setSession(data);
  }

  async function updateProfile({ user }: { user: User }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const currentSession = session;

      if (!currentSession) return;

      const updatedSession = {
        token: currentSession.token,
        user: {
          ...currentSession.user,
          ...user,
        },
      };

      localStorage.setItem(
        `${LOCAL_STORAGE_KEY}:user`,
        JSON.stringify(updatedSession.user),
      );

      setSession(updatedSession);
    } catch (error) {
      throw error;
    }
  }

  function remove() {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`);

    window.location.assign("/");
    setSession(null);
  }

  function loadUser() {
    const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`);
    const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`);

    if (token && user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setSession({
        token,
        user: JSON.parse(user),
      });
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, save, isLoading, remove, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
