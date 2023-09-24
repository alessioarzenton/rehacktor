import { useEffect, useState } from "react";
import Card from "../../UI/Card/Card";
import GenresList from "../../UI/GenresList/GenresList";
import classes from "./Search.module.css";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Loader from "../../UI/Loader/Loader";
import { useContext } from "react";
import { ConfigContext } from "./../../../Contexts/Config/index";

export default function Search() {
  const [genres, setGenres] = useState(null);

  let { genre } = useParams();
  let { num } = useParams();
  let { api_urls, api_secrets } = useContext(ConfigContext);

  const [games, setGames] = useState(null);

  const [searched, setSearched] = useState("");

  useEffect(() => {
    fetch(`${api_urls.games}/api/genres?&key=${api_secrets.games}`)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.results);
      });
  }, []);

  useEffect(() => {
    setGames(null);
    fetch(
      `${api_urls.games}/api/games?&key=${api_secrets.games}&genres=${genre}&page=${num}&page_size=12`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setGames(data.results);
      });
  }, [genre, num]);

  useEffect(() => {
    if (searched.length > 4) {
      fetch(
        `${api_urls.games}/api/games?&key=${api_secrets.games}&page_size=24&search=${searched}&search_precise=true`,
      )
        .then((response) => response.json())
        .then((data) => {
          setGames(data.results);
        });
    }
  }, [searched]);

  return (
    <div
      className={"container-fluid my-5 py-5 min-vh-100 " + classes["bg-info"]}
    >
      <div className="row my-5">
        <div className="col-12 col-md-3 col-lg-2">
          {genres && <GenresList data={genres} />}
        </div>
        <div className="col-12 col-md-9 col-lg-10">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control bg-transparent border-0 border-bottom border-info rounded-0 text-white"
                  placeholder="Search by name"
                  onChange={(ev) => setSearched(ev.target.value)}
                  value={searched}
                />
                <button className="btn border-0" type="button">
                  <i className="fal fa-chevron-right text-main"></i>
                </button>
              </div>
            </div>
          </div>
          {!searched && (
            <div className="row justify-content-between mb-5">
              <div className="col-2">
                {num > 1 ? (
                  <Link
                    className="text-decoration-none text-white"
                    to={`/search/${genre}/${+num - 1}`}
                  >
                    <i className="fal fa-chevron-left fa-2x"></i>
                  </Link>
                ) : (
                  " "
                )}
              </div>
              <div className="col-2">
                <Link
                  className="text-decoration-none text-white"
                  to={`/search/${genre}/${+num + 1}`}
                >
                  <i className="fal fa-chevron-right fa-2x"></i>
                  {num}
                </Link>
              </div>
            </div>
          )}
          <div className="row">
            {games ? (
              games.map((game) => (
                <div key={game.id} className="col-12 col-md-6 col-lg-4 mb-5">
                  <Card
                    image={game.background_image}
                    name={game.name}
                    slug={game.slug}
                  />
                </div>
              ))
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
