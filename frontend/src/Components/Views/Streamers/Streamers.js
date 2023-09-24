import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ConfigContext } from "../../../Contexts/Config";
import { useContext } from "react";

export default function Streamers() {
  const [rooms, setRooms] = useState();
  const { api_urls } = useContext(ConfigContext);

  useEffect(() => {
    fetch(`${api_urls.backend}/api/users/room/roomsActive`)
      .then((response) => response.json())
      .then((rooms) => {
        console.log(rooms);
        setRooms(rooms);
      });
  }, []);

  function millToHour(n) {
    let t = n / (1000 * 60);

    let h = Math.floor(t / 60);
    let m = t % 60;

    return `${h}h ${m.toFixed(0)}min`;
  }

  return (
    <div className="container mt-5 min-vh-100">
      <div className="row mt-5 pt-5">
        <div className="col-12">
          <h1>Choose your streamer</h1>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr className="text-main">
                  <th scope="col">Username</th>
                  <th scope="col">Game</th>
                  <th scope="col">Seats</th>
                  <th scope="col">Time</th>
                  <th scope="col">Link</th>
                </tr>
              </thead>
              <tbody>
                {rooms &&
                  rooms.map((room) => {
                    return (
                      <tr key={room.id}>
                        <td className="pt-3">{room.user.name}</td>
                        <td className="pt-3">
                          {room.game_name.replace(/-/g, " ").toUpperCase()}
                        </td>
                        <td className="pt-3">{room.max_seats_available}</td>
                        <td className="pt-3">
                          {millToHour(new Date() - new Date(room.created_at))}
                        </td>
                        <td className="pt-3">
                          <Link
                            to={`/join-room/${room.id}`}
                            className="text-decoration-none text-white"
                          >
                            Join <i className="fal fa-chevron-right"></i>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
