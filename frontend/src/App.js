import "./App.css";
import Footer from "./Components/UI/Footer/Footer";
import Navbar from "./Components/UI/Navbar/Navbar";
import Home from "./Components/Views/Home/Home";
import Search from "./Components/Views/Search/Search";
import Game from "./Components/Views/Game/Game";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "./Contexts/Auth";
import { ConfigProvider } from "./Contexts/Config";
import { StreamingProvider } from "./Contexts/Streaming";

import Sign from "./Components/Views/Sign/Sign";
import Profile from "./Components/Views/Profile/Profile";

// UTILITIES
import ProtectedRoute from "./Components/Utilities/ProtectedRoute";
import Stream from "./Components/Views/Stream/Stream";
import Streamers from "./Components/Views/Streamers/Streamers";
import Join from "./Components/Views/Join/Join";

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <StreamingProvider>
          <Router>
            <Navbar />

            <Switch>
              <Route path="/game/:slug">
                <Game />
              </Route>
              <Route path="/search/:genre/:num">
                <Search />
              </Route>
              <Route path="/sign">
                <Sign />
              </Route>

              <ProtectedRoute path="/stream/:game_name/:game_id">
                <Stream />
              </ProtectedRoute>

              <ProtectedRoute path="/streamers">
                <Streamers />
              </ProtectedRoute>

              <ProtectedRoute path="/join-room/:room_id">
                <Join />
              </ProtectedRoute>

              <ProtectedRoute path="/profile">
                <Profile />
              </ProtectedRoute>

              <Route path="/">
                <Home />
              </Route>
            </Switch>

            <Footer />
          </Router>
        </StreamingProvider>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
