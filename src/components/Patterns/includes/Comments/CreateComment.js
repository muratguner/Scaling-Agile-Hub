import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Button, Divider, Paper, Typography } from "@material-ui/core";
import ItemsService from "../../../../services/ItemsService";
import RichTextEditor from "react-rte";
import StarRatingComponent from "react-star-rating-component";

const useStyles = makeStyles((theme) => {
  return {
    createCommentRoot: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.common.white,
    },
    editorBounds: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
    },
    editor: {
      margin: theme.spacing(1),
      fontFamily: theme.typography.fontFamily,
    },
    submitFooter: {
      margin: theme.spacing(1),
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
  };
});

const CreateComment = (props) => {
  const { commentOnly, pattern, patternName, isSubCommentOf } = props;
  const classes = useStyles();
  const [commentEditorState, setCommentEditorState] = React.useState(
    RichTextEditor.createValueFromString("", "html")
  );
  const [rating, setRatingState] = React.useState();

  const updateComment = (e) => {
    setCommentEditorState(e);
  };

  const setRating = (e) => {
    setRatingState(e);
  };

  const sendComment = () => {
    var isSubCommentOfTemp = isSubCommentOf;
    if (isSubCommentOf === undefined || isSubCommentOf === null) {
      isSubCommentOfTemp = "";
    }
    var returned = ItemsService.addFeedback(
      pattern,
      patternName,
      isSubCommentOfTemp,
      rating,
      commentEditorState.toString("html")
    );
    returned.then((data) => {
      props.callBack("reload" + Math.random().toString(36).substring(7));
    });
  };

  const isTextValidated = () => {
    const a =
      commentEditorState.toString("html").replace("<p><br></p>", "").trim()
        .length > 0
        ? true
        : false;
    if (a && rating !== undefined) return true;
    if (a && commentOnly === true) {
      setRating(-1);
      return true;
    }
    return false;
  };

  return (
    <div className={classes.createCommentRoot}>
      <div className={classes.editorBounds}>
        {commentOnly === false && (
          <div style={{ paddingBottom: "8px" }}>
            <Typography variant="h5" color="primary">
              Rating
            </Typography>
            <div style={{ paddingTop: "8px" }}>
              {" "}
              <StarRatingComponent
                name="rate1"
                starCount={5}
                value={rating}
                onStarClick={setRating}
                starColor={"#195b8b"}
                emptyStarColor={"#cecece"}
              />
            </div>
          </div>
        )}
        <Typography variant="h5" color="primary">
          Comment
        </Typography>
        <RichTextEditor
          value={commentEditorState}
          onChange={updateComment}
          className={classes.editor}
        />
      </div>
      <div className={classes.submitFooter}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => sendComment()}
          disabled={!isTextValidated()}
        >
          Submit
        </Button>
      </div>
      <Divider variant="fullWidth" />
    </div>
  );
};

export default CreateComment;
