import { createContext, useState } from "react";

export const StreamingContext = createContext();

export function StreamingProvider(props) {
  const [isStreaming, setIsStreaming] = useState(localStorage.getItem("game"));

  const setStreamingOn = () => setIsStreaming(true);
  const setStreamingOff = () => setIsStreaming(false);

  return (
    <StreamingContext.Provider
      value={{ isStreaming, setStreamingOn, setStreamingOff }}
    >
      {props.children}
    </StreamingContext.Provider>
  );
}
