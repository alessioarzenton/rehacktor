import { AuthContext } from "../../../Contexts/Auth";
import { useContext } from "react";
export default function Profile() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5 min-vh-100">
      <div className="row min-vh-100 pt-5 mt-5">
        <div className="col-12">
          <h3>Bentornato, {user.username}</h3>
        </div>
        <div className="col-12">TODO: Statistiche utente</div>
      </div>
    </div>
  );
}
