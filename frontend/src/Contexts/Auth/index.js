import { useState, useContext, createContext } from "react";
import { ConfigContext } from "./../Config";

export const AuthContext = createContext();

export function AuthProvider(props) {
  const initialUser = localStorage.getItem("user");

  let { api_urls } = useContext(ConfigContext);

  const [user, setUser] = useState(JSON.parse(initialUser));

  const login = (username, token, id) => {
    const obj = {
      username: username,
      token: token,
      id: id,
    };

    setUser(obj);
    localStorage.setItem("user", JSON.stringify(obj));
  };

  const logout = () => {
    fetch(`${api_urls.backend}/api/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then(() => {
      window.location.href = "/";
      localStorage.removeItem("user");
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}
