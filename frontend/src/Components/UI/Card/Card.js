import classes from "./Card.module.css";
import { Link } from "react-router-dom";

export default function Card(props) {
  return (
    <div className={classes["card-game"]}>
      <Link to={`/game/${props.slug}`}>
      <img src={props.image} alt="test" />
      <p>{props.name}</p>
      </Link>
    </div>
  );
}
