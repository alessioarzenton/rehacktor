import { useEffect, useState, useRef, useContext } from "react";

import { useParams } from "react-router";
import { joinStreaming } from "./../../../utilities/twilio";
import Loader from "../../UI/Loader/Loader";
import { Link } from "react-router-dom";
import { ConfigContext } from "../../../Contexts/Config";

import classes from "./Join.module.css";

export default function Join() {
  const { room_id } = useParams();

  const StreamerVideo = useRef("video");
  const StreamerFace = useRef("face");

  const [loading, streaming, closed, full] = [
    "loading",
    "streaming",
    "closed",
    "full",
  ];

  const [status, setStatus] = useState(loading);
  const [info, setInfo] = useState();

  let { api_urls } = useContext(ConfigContext);
  const token = JSON.parse(localStorage.getItem("user")).token;

  useEffect(() => {
    fetch(`${api_urls.backend}/api/users/room/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ room_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "room closed") {
          setStatus(closed);
          return;
        }

        if (data === "no more seat available") {
          setStatus(full);
          return;
        }

        console.log(data, "DATA");
        setStatus(streaming);

        joinStreaming(
          data.jwt,
          data.room_name,
          (track) => {
            StreamerVideo.current.appendChild(track.attach());
          },
          (track) => {
            StreamerFace.current.appendChild(track.attach());
          },
          () => setStatus(closed),
        );
      })
      .then(() => {
        fetch(`${api_urls.backend}/api/users/room/streamer/${room_id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "info");
            setInfo(data);
          });
      });
  }, []);

  const showLoading = () => {
    if (status === loading) return <Loader />;
  };

  const showFull = () => {
    if (status === full) {
      return (
        <div className="col-12">
          <p>Stanza piena!</p>
          <Link to="/streamers">Torna alla lista</Link>
        </div>
      );
    }
  };

  const showTransmissionInterrupted = () => {
    if (status === closed) {
      return (
        <div className="col-12">
          <p>Lo streamer ha interrotto la trasmissione!</p>
          <Link to="/streamers">Torna alla lista</Link>
        </div>
      );
    }
  };

  return (
    <div className="container min-vh-100 mt-5 ">
      <div className="row my-5">
        <div className="col-12 position-relative mt-5 pt-5">
          <div className={classes.wrapperTracks}>
            <div className={classes.streamer} ref={StreamerVideo}></div>

            <div className={classes.streamerBlock}>
              <div className={classes.viewer} ref={StreamerFace}></div>
              {info && <div className={classes.label}>{info.streamer}</div>}
            </div>
          </div>
        </div>
        {showLoading()}
        {showFull()}
        {showTransmissionInterrupted()}
      </div>
    </div>
  );
}
