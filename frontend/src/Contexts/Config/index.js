import { createContext } from "react";

export const ConfigContext = createContext();

export function ConfigProvider(props) {
  const api_urls = {
    backend: process.env.REACT_APP_API_URL,
    games: process.env.REACT_APP_GAMES_API_URL,
  };

  const api_secrets = {
    games: process.env.REACT_APP_GAMES_SECRET,
  };

  return (
    <ConfigContext.Provider value={{ api_urls, api_secrets }}>
      {props.children}
    </ConfigContext.Provider>
  );
}
