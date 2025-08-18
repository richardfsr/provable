import { createContext, useState, useEffect, useCallback } from "react";
import apiClient from "@/utils/client/apiClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const asyncGetUser = useCallback(async (apiKey) => {
    const res = await apiClient.post("/getUserFromAPIKey", { apiKey: apiKey });
    if (res.status === 200) {
      setUser(res.data.user);
    } else if (res.status === 404) {
      localStorage.removeItem("api_key");
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const apiKey = localStorage.getItem("api_key");
    if (apiKey) {
      asyncGetUser(apiKey);
    }
  }, [asyncGetUser]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
