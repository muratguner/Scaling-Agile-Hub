import React from "react";

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { ParallaxProvider } from "react-scroll-parallax";

import { ThemeProvider } from "@material-ui/styles";

import FrameworksView from "./views/FrameworksView";
import HomeView from "./views/HomeView";
import NotFoundView from "./views/NotFoundView";
import TestView from "./views/TestView";
import VisualizationsView from "./views/VisualizationsView";
import PatternsView from "./views/PatternsView";
import CookieDisclaimer from "./components/CookieDisclaimer";
import { GLOBAL_THEME } from "./config";
import ProfilePage from "./views/ProfilePage";
import Firebase from "./firebase";

const App = ({ history }) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const title = "Recommender System for Scaling Agile Frameworks";

  React.useEffect(() => {
    document.title = title;
    setTimeout(() => {
      if (
        !localStorage.getItem("cookies") ||
        new Date().getTime() -
          JSON.parse(localStorage.getItem("cookies")).noticedAt >
          7 * 24 * 60 * 60 * 1000
      ) {
        setOpenSnackbar(true);
      }
    }, 1000);
  }, []);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    localStorage.setItem(
      "cookies",
      JSON.stringify({ noticedAt: new Date().getTime() })
    );
    setOpenSnackbar(false);
  };

  const checkAuth = () => {
    if (localStorage.getItem("authentication")) {
      var expiry = JSON.parse(localStorage.getItem("authentication")).expires;
      if (Date.now() > expiry) {
        localStorage.removeItem("authentication");
        localStorage.removeItem("userInfo");
      }
    }
    return true;
  };

  const isLoggedIn = () => {
    if (localStorage.getItem("authentication")) {
      var expiry = JSON.parse(localStorage.getItem("authentication")).expires;
      if (Date.now() < expiry) {
        return true;
      }
    }
    return false;
  };

  return (
    <ThemeProvider theme={GLOBAL_THEME}>
      <ParallaxProvider>
        <Router>
          <Switch>
            <Route exact path="/" component={checkAuth() && HomeView} />
            <Route
              exact={false}
              path="/frameworks"
              component={checkAuth() && FrameworksView}
            />
            <Route
              exact
              path="/visualizations"
              component={checkAuth() && VisualizationsView}
            />
            <Route
              exact={false}
              path="/patterns"
              component={checkAuth() && PatternsView}
            />
            <Route exact path="/test" component={checkAuth() && TestView} />

            <Route
              exact
              path="/profilepage"
              component={checkAuth() && isLoggedIn() ? ProfilePage : HomeView}
            />

            <Route path="*" component={checkAuth() && NotFoundView} />
            <Firebase></Firebase>
          </Switch>
        </Router>
      </ParallaxProvider>
      <CookieDisclaimer open={openSnackbar} handleClose={handleCloseSnackbar} />
    </ThemeProvider>
  );
};

export default App;
