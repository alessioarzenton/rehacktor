import classes from "./GenresList.module.css";
import { Link } from "react-router-dom";

export default function GenresList(props) {
  return (
    <div className={classes["genres-wrapper"]}>
      {props.data.map((genre) => (
        <Link
          key={genre.id}
          className="text-decoration-none"
          to={`/search/${genre.slug}/1`}
        >
          <button
            key={genre.id}
            className="btn btn-outline-info rounded-0 w-100 mb-2 d-block text-start"
          >
            {genre.name}
          </button>
        </Link>
      ))}
    </div>
  );
}
