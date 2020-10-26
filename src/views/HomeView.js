import React from "react";

import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ItemsService from "../services/ItemsService";

import HomeViewComponent from "../components/Home/HomeViewComponent";
import Header from "../components/Header";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  appBar: {
    background: "transparent",
    position: "absolute",
  },
  loader: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: "-37.5px",
    marginTop: "-37.5px",
  },
}));

const HomeView = (props) => {
  const { history } = props;

  const classes = useStyles();

  const [allData, setAllData] = React.useState();
  const [allComments, setAllComments] = React.useState();
  const [allRatings, setAllRatings] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleSetData = (data) => {
    setAllData(data);
  };

  const handleSetComments = (comments) => {
    setAllComments(comments);
  };

  const handleSetRatings = (ratings) => {
    setAllRatings(ratings);
  };

  React.useEffect(() => {
    const allUnresolvedData = ItemsService.getPatternData();
    const numOfEntities = allUnresolvedData.flatMap((e) => e).length;
    const ratingsData = ItemsService.getClapCount();
    const allFeedbackData = ItemsService.getFeedback();
    let dataSet = [];
    allUnresolvedData.forEach((level, indexLevel) => {
      dataSet.push([]);
      level.forEach((entity) => {
        entity.promise.then((data) => {
          dataSet[indexLevel].push({
            description: entity.description,
            data: data.value,
          });
          if (
            dataSet.reduce((sum, level) => sum + level.length, 0) ===
            numOfEntities
          ) {
            handleSetData(dataSet);
          }
        });
      });
    });
    ratingsData.promise.then((data) => {
      handleSetRatings(data.value);
    });
    allFeedbackData.promise.then((data) => {
      handleSetComments(data.value);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <CircularProgress size={75} thickness={4} className={classes.loader} />
    );
  }

  return (
    <div className={classes.root}>
      <Header history={history} appBarClasses={classes.appBar} elevation={0} />
      <HomeViewComponent
        allData={allData}
        allComments={allComments}
        allRatings={allRatings}
      />
      <Footer />
    </div>
  );
};

export default HomeView;
