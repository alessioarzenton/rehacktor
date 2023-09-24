import { startStreaming } from "../../../utilities/twilio";
import { useParams } from "react-router";

// Contexts
import { AuthContext } from "./../../../Contexts/Auth";
import { ConfigContext } from "./../../../Contexts/Config";
import { StreamingContext } from "./../../../Contexts/Streaming";

import { useContext, useRef } from "react";
import useInput from "./../../../Hooks/useInput";

export default function Stream() {
  const myFaceVideo = useRef(null);

  const { game_name, game_id } = useParams();

  const { user } = useContext(AuthContext);
  const { api_urls } = useContext(ConfigContext);
  const { isStreaming, setStreamingOn, setStreamingOff } =
    useContext(StreamingContext);

  const number = useInput(1);
  const token = JSON.parse(localStorage.getItem("user")).token;

  function startStream(ev) {
    ev.preventDefault();

    let object = {
      game_name: game_name,
      game_id: game_id,
      max_seats_available: number.value,
    };

    // creo stanza e ottengo jwt
    fetch(`${api_urls.backend}/api/users/room/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(object),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("game", JSON.stringify(object));

        // attivare lo streaming
        startStreaming(data.twillio.jwt, data.twillio.room_name, myFaceVideo)
          .then(() => {
            console.log("streaming lanciato");
            setStreamingOn();
          })
          .catch((e) => {
            console.log("errore, ", e);

            //endStream();
          });
      });
  }
  /* function endStream() {
    fetch(`${api_urls.backend}/api/users/room/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ops....");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Ending, ", data);
        localStorage.removeItem("game");
        setStreamingOff();
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  } */

  return (
    <div className="container min-vh-100 mt-5">
      <div className="row mt-5">
        <div className="col-12 col-md-6 mt-5">
          <h2>Hello, {user.username}</h2>

          {isStreaming ? (
            <div>
              Already streaming.
              {/* <button className="btn btn-danger mt-5" onClick={endStream}>
                Close
              </button> */}
            </div>
          ) : (
            <div>
              <p>You are going to stream {game_name}</p>

              <p>Select a number {number.value}</p>

              <form className="w-25" onSubmit={startStream}>
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="10"
                  step="1"
                  id="range"
                  value={number.value}
                  {...number}
                />
                <button className="btn btn-info">Stream now!</button>
              </form>
            </div>
          )}

          <div ref={myFaceVideo}></div>
        </div>
      </div>
    </div>
  );
}
