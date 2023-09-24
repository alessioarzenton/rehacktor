import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loadering from "../../UI/Loader/Loader";
import { useContext } from "react";
import { ConfigContext } from "./../../../Contexts/Config/index";
import { AuthContext } from "./../../../Contexts/Auth/index";

export default function Game() {
    let { slug } = useParams();

    let { api_urls, api_secrets } = useContext(ConfigContext);

    let { user } = useContext(AuthContext);

    const [game, setGame] = useState(null);
    const [streamers, setStreamers] = useState(null);

    useEffect(() => {
        fetch(`${api_urls.games}/api/games/${slug}?&key=${api_secrets.games}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setGame(data);

                return data.id;
            })
            .then((id) => {
                fetch(
                    `${api_urls.backend}/api/users/room/roomsByGame?game_id=${id}`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        setStreamers(data);
                    });
            });
    }, [api_urls.games, api_secrets.games, api_urls.backend, slug]);

    /*   useEffect(() => {
    fetch(`${api_urls.background}api/users/room/roomsByGame?game_id=35`)
      .then((response) => response.json())
      .then((data) => {
        setGame(data);
      });
  }, [api_urls.games, api_secrets.games, slug]);  */

    return (
        <>
            {game ? (
                <div
                    className="container-fluid pt-5 min-vh-100"
                >
                    <div className="container">
                        <div className="row mt-5">
                            <div className="col-12">
                                <h1>{game.name}</h1>
                                {game.developers && game.developers?.length ? (
                                    <p className="small">
                                        Developed by {game.developers[0].name}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col-12 col-md-6">
                                {game.description_raw}
                            </div>
                            <div className="col-12 col-md-6">
                                <img
                                    className="img-fluid"
                                    src={game.background_image}
                                    alt={game.name}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <h3>Genres</h3>
                            <div>
                                {game.genres.map((el) => (
                                    <Link
                                        key={el.id}
                                        to={`/search/${el.slug}/1`}
                                        className="text-decoration-none me-2"
                                    >
                                        <button className="btn btn-small btn-outline-info rounded-0 px-5">
                                            {el.name}
                                        </button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="row my-5">
                            <div className="col-12 col-md-4 col-lg-3 mb-5">
                                <p className="h4 text-main">Informations</p>

                                <div className="mb-3">
                                    <p className="small mb-0">WEBSITE</p>
                                    <p className="ms-3 mb-0">
                                        <i className="fal fa-level-up fa-rotate-90 text-main me-3"></i>
                                        <a
                                            className="text-decoration-none text-white"
                                            href={game.website}
                                        >
                                            Go to{" "}
                                            <i className="fal fa-chevron-right"></i>
                                        </a>
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <p className="small mb-0">RELEASED</p>
                                    <p className="ms-3 text-white mb-0">
                                        <i className="fal fa-level-up fa-rotate-90 text-main me-3"></i>
                                        {game.released}
                                    </p>
                                </div>
                                <div className="mb-3">
                                    <p className="small mb-0">PLAYTIME</p>
                                    <p className="ms-3 text-white mb-0">
                                        <i className="fal fa-level-up fa-rotate-90 text-main me-3"></i>
                                        {game.playtime} h
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 col-md-4 col-lg-3 mb-5">
                                <p className="h4 text-main">Ratings</p>
                                {game.ratings.map((el) => {
                                    return (
                                        <div key={el.id} className="mb-3">
                                            <p className="small mb-0">
                                                {el.title.toUpperCase()}
                                                <span className="float-end">
                                                    {el.percent}%
                                                </span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="col-12 col-md-4 col-lg-3">
                                <p className="h4 text-main">Streamers</p>
                                {streamers && streamers.length > 0 ? (
                                    <ul>
                                        {streamers.map((streamer) => (
                                            <li key={streamer.user.id}>
                                                {streamer.user.name}
                                                <Link
                                                    to={`/join-room/${streamer.id}`}
                                                    className="text-decoration-none text-white ms-5"
                                                >
                                                    Join{" "}
                                                    <i className="fal fa-chevron-right"></i>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    "No one is streaming this game."
                                )}
                            </div>
                            <div className="col-12 col-md-4 col-lg-3">
                                {user ? (
                                    <Link
                                        to={`/stream/${game.slug}/${game.id}`}
                                        className="h4 text-main text-decoration-none fst-italic"
                                    >
                                        <i className="fal fa-chevron-right" />{" "}
                                        Start Your Stream
                                    </Link>
                                ) : (
                                    "You must be logged to stream."
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loadering />
            )}
        </>
    );
}
