import classes from "./Loader.module.css";

export default function Loader() {
  return (
    <div className={classes.loader}>
      <div className={classes.one + " " + classes.circle}></div>
      <div className={classes.two + " " + classes.circle}></div>
      <div className={classes.three + " " + classes.circle}></div>
    </div>
  );
}
