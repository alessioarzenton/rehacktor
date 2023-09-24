import Video from "./../../../Assets/video.mp4";
import classes from "./Header.module.css";

export default function Header() {
  return (
    <header className="mb-5">
      <div className={classes.overlay}></div>

      <video playsInline autoPlay muted loop>
        <source src={Video} type="video/mp4" />
      </video>

      <div className={classes.container + " h-100"}>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-12 col-md-6 col-lg-4 text-center">
            <h1 className="display-1 font-exan text-main">ReHacktor</h1>
            <p className="lead mb-0">
              Explore Rehacktor, the only site that allows you to discover new
              games and share experience with your friends!
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
