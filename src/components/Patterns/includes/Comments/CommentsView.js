import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import SingleComment from "./SingleComment";
import CreateComment from "./CreateComment";
import ItemsService from "../../../../services/ItemsService";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      margin: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.common.white,
    },
    comments: {
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      width: "100%",
      maxWidth: "100%",
    },
    loader: {
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: "100%",
      maxWidth: "100%",
    },
  };
});

const CommentsView = (props) => {
  const { comments, pattern, patternName } = props;
  const [
    commentsForSelectedPatternState,
    setCommentsForSelectedPatternState,
  ] = React.useState([...props.comments]);
  const [reloadStartState, setreloadStartState] = React.useState(false);

  const classes = useStyles();
  React.useEffect(() => {
    setCommentsForSelectedPatternState([
      ...comments
        .filter(function (row) {
          return row.pattern === pattern;
        })
        .sort(function (a, b) {
          return b.timestamp - a.timestamp;
        }),
    ]);
    setTimeout(() => {
      setreloadStartState(false);
    }, 1000);
  }, [...props.comments]);

  var commentsForSelectedPattern = comments
    .filter(function (row) {
      return row.pattern === pattern;
    })
    .sort(function (a, b) {
      return b.timestamp - a.timestamp;
    });
  var numberOfComments = commentsForSelectedPattern.length;
  return (
    <div className={classes.root}>
      {!reloadStartState ? (
        <div>
          <Typography variant="h4">{numberOfComments} Comment(s)</Typography>
          <div className={classes.comments}>
            {ItemsService.isLoggedIn() ? (
              <CreateComment
                reloadStart={setreloadStartState}
                callBack={props.callBack}
                commentOnly={false}
                pattern={pattern}
                patternName={patternName}
                isSubCommentOf={null}
              />
            ) : null}
            {commentsForSelectedPatternState.map((comment, index) => {
              return (
                <SingleComment
                  reloadStart={setreloadStartState}
                  comment={comment}
                  comments={comments}
                  callBack={props.callBack}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <CircularProgress size={75} thickness={4} className={classes.loader} />
      )}
    </div>
  );
};

export default CommentsView;
