import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";

import ItemsService from "../services/ItemsService";
import PatternViewComponent from "../components/Patterns/PatternViewComponent";
import Footer from "../components/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#fafafa",
  },
  loader: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: "-37.5px",
    marginTop: "-37.5px",
  },
}));

const PatternsView = (props) => {
  const { history } = props;

  const classes = useStyles();

  const [data, setData] = React.useState();
  const [comments, setComments] = React.useState();
  const [loading, setLoading] = React.useState(true);

  const handleSetData = (data) => {
    setData(data);
  };

  const handleSetComments = (comments) => {
    setComments(comments);
  };

  React.useEffect(() => {
    const unresolvedData = ItemsService.getPatternData();
    const feedbackData = ItemsService.getFeedback();
    const numEntities = unresolvedData.flatMap((e) => e).length;

    let dataSet = [];
    unresolvedData.forEach((level, indexLevel) => {
      dataSet.push([]);
      level.forEach((entity) => {
        entity.promise.then((data) => {
          dataSet[indexLevel].push({
            description: entity.description,
            data: data.value,
          });
          if (
            dataSet.reduce((sum, level) => sum + level.length, 0) ===
            numEntities
          ) {
            handleSetData(dataSet);
            setLoading(false);
          }
        });
      });
    });
    feedbackData.promise.then((data) => {
      handleSetComments(data.value);
    });
  }, []);

  if (loading) {
    return (
      <CircularProgress size={75} thickness={4} className={classes.loader} />
    );
  }

  return (
    <div className={classes.root}>
      <PatternViewComponent history={history} data={data} comments={comments} />
      <Footer />
    </div>
  );
};

export default PatternsView;
