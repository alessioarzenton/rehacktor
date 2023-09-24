import classes from "./Navbar.module.css";
import { Link } from "react-router-dom";

import { AuthContext } from "./../../../Contexts/Auth";
import { ConfigContext } from "./../../../Contexts/Config";
import { StreamingContext } from "./../../../Contexts/Streaming";
import { useState, useContext } from "react";
import Modal from "../Modal/Modal";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { api_urls } = useContext(ConfigContext);
  const { isStreaming, setStreamingOff } = useContext(StreamingContext);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const [modal, setModal] = useState(false);
  const closeModal = () => setModal(false);

  function endStream() {
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
  }

  return (
    <nav
      className={
        "navbar navbar-expand navbar-dark shadow fixed-top " + classes.navbar
      }
    >
      <div className="container-fluid">
        <Link className="text-decoration-none fw-bold text-main" to="/">
          <i className="fab fa-react fa-spin me-3"></i>
          ReHacktor
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/search/action/1">
                Search
              </Link>
            </li>

            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/sign">
                  Sign
                </Link>
              </li>
            )}

            {user && (
              <>
                {modal && (
                  <Modal
                    title="Oh no..."
                    message="Vuoi già lasciarci?"
                    declineMessage="Rimani"
                    confirmMessage="Esci"
                    closeModal={closeModal}
                    action={logout}
                    isStreaming={isStreaming}
                  />
                )}

                <li className="nav-item">
                  <Link to="/streamers" className="nav-link text-white">
                    Streamers
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/profile" className="nav-link text-white">
                    <i className="fal fa-user-circle me-2"></i>
                    {user.username}
                  </Link>
                </li>
                {isStreaming && (
                  <li className="nav-item">
                    <span className="nav-link">
                      <i
                        className="fas fa-circle text-danger ms-2"
                        onClick={endStream}
                      ></i>
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn" onClick={() => setModal(true)}>
                    <i className="fas fa-portal-exit text-main"></i>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
