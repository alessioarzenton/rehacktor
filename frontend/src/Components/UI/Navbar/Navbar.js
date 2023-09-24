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
          <svg className="me-3" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M13.9393 12.253L19.2219 6.9705C17.7532 5.15584 15.5108 4 13 4C8.58172 4 5 7.58172 5 12C5 16.4183 8.58172 20 13 20C14.4795 20 15.8631 19.5997 17.0511 18.9004L13.9393 15.7886C12.963 14.8123 12.963 13.2294 13.9393 12.253ZM21.6065 6.9049C21.7195 7.09545 21.6835 7.33726 21.5269 7.49393L15.3536 13.6673C15.1583 13.8625 15.1583 14.1791 15.3536 14.3744L19.7066 18.7274C19.902 18.9229 19.9026 19.2409 19.6974 19.4261C17.9246 21.0259 15.576 22 13 22C7.47715 22 3 17.5228 3 12C3 6.47715 7.47715 2 13 2C16.662 2 19.8643 3.96842 21.6065 6.9049ZM14 9C14.5523 9 15 8.55228 15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8C13 8.55228 13.4477 9 14 9Z" fill="white" fill-rule="evenodd"/></svg>
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
