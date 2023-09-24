import useInput from "../../../Hooks/useInput";
import { useHistory } from "react-router";
import { AuthContext } from "../../../Contexts/Auth";
import { ConfigContext } from "../../../Contexts/Config";
import { useContext } from "react";

export default function SignIn() {
  const history = useHistory();
  let { login } = useContext(AuthContext);
  let { api_urls } = useContext(ConfigContext);

  const email = useInput("");
  const password = useInput("");

  const signIn = (event) => {
    event.preventDefault();

    fetch(`${api_urls.backend}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
      .then((response) => response.json())
      .then((data) => {
        const token = data.token;

        fetch(`${api_urls.backend}/api/users/view-profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            login(data.data.name, token, data.data.id);
            history.push("/");
          });
      });
  };

  return (
    <>
      <form className="sign-form" onSubmit={signIn}>
        <div className="sign-top"></div>
        <div className="sign-bottom"></div>
        <div className="mb-5">
          <label className="form-label" htmlFor="userMail">
            Inserisci la tua mail
          </label>
          <input
            type="email"
            className="form-control bg-transparent border-0 border-bottom border-info rounded-0 text-white"
            id="userMail"
            {...email}
          />
        </div>
        <div className="mb-5">
          <label className="form-label" htmlFor="userPassword">
            Inserisci la tua password
          </label>
          <input
            type="password"
            className="form-control bg-transparent border-0 border-bottom border-info rounded-0 text-white"
            id="userPassword"
            {...password}
          />
        </div>
        <div className="mb-5">
          <button type="submit" className="btn btn-outline-info px-5 rounded-0">
            Login
          </button>
        </div>
      </form>
    </>
  );
}
