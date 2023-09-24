import { useState } from "react";
import SignIn from "../../UI/SignIn/SignIn";
import SignUp from "../../UI/SignUp/SignUp";
import classes from "./Sign.module.css";

export default function Sign() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={"container-fluid min-vh-100 " + classes.bg}>
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-md-8 col-lg-6 text-center">
            {isLogin ? <SignIn /> : <SignUp />}
            <button
              className="mt-5 btn btn-outline-info rounded-0"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Not a user? Register now!"
                : "Already a user? Login now!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
