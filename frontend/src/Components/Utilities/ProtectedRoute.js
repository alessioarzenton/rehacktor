/* import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../Contexts/Auth";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  

  return (
    <Route
      {...rest}
      render={(props) => {
        if (user) {
          return <Component {...rest} {...props} />;
        } else {
          return <Redirect to="/sign" />;
        }
      }}
    />
  );
};

export default ProtectedRoute;
 */

import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "../../Contexts/Auth";

function ProtectedRoute({ children, ...rest }) {
  const { user } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={() => (user ? children : <Redirect to="/sign" />)}
    />
  );
}

export default ProtectedRoute;
