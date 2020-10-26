import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Fab,
  IconButton,
  Icon,
  Typography,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ItemsService from "../../../../services/ItemsService";
import ReactHtmlParser from "react-html-parser";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateComment from "./CreateComment";

const useStyles = makeStyles((theme) => {
  return {
    singleCommentRoot: {
      marginLeft: theme.spacing(8),
      marginRight: theme.spacing(8),
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.common.white,
    },
    userIcon: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      backgroundColor: theme.palette.primary.main,
    },
    margin: {
      margin: theme.spacing(1),
    },
    deleteIcon: {
      marginLeft: "auto",
      margin: theme.spacing(1),
    },
    imageIcon: {
      height: "100%",
      filter: "invert(1)",
    },
    iconRoot: {
      textAlign: "center",
      marginRight: theme.spacing(1),
    },
    actions: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      margin: theme.spacing(1),
    },
  };
});

const SingleComment = (props) => {
  const { comment, comments } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const sendUpvote = () => {
    var returned = ItemsService.upvoteComment(
      comment.id,
      comment.name,
      comment.pattern,
      comment.patternName,
      comment.isSubCommentOf,
      comment.timestamp,
      `${parseInt(comment.upvotes) + 1}`,
      comment.userid,
      comment.username,
      comment.comment
    );
    returned.then((data) => {
      window.location.reload();
    });
  };
  const deleteComment = () => {
    var returned = ItemsService.deleteComment(comment.id);
    returned.then((data) => {
      window.location.reload();
    });
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const getQuotedComment = () => {
    var a = comments.filter(function (val, index) {
      return val.name === comment.isSubCommentOf;
    });
    if (a.length > 0) {
      return "<strong>Replying to: </strong>" + a[0].value;
    }
  };

  return (
    <div className={classes.singleCommentRoot}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar className={classes.userIcon} color="primary">
              {comment.username[0]}
            </Avatar>
          }
          title={
            <Typography component={"div"} variant="subtitle2">
              {comment.username}
            </Typography>
          }
          subheader={
            <Typography
              component={"div"}
              variant="body2"
              style={{ color: "grey" }}
            >
              {new Date(parseInt(comment.timestamp)).toUTCString()}
            </Typography>
          }
        />
        <CardContent>
          {comment.isSubCommentOf === undefined ||
          comment.isSubCommentOf === null ? null : (
            <div>
              <Typography component={"div"} style={{ color: "gray" }}>
                {ReactHtmlParser(getQuotedComment())}
              </Typography>
              <Divider variant="fullWidth" />
            </div>
          )}
          <Typography component={"div"}>
            {ReactHtmlParser(comment.comment)}
          </Typography>
        </CardContent>
        {ItemsService.isLoggedIn() ? (
          <CardActions disableSpacing className={classes.actions}>
            <Fab
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
              className={classes.margin}
              onClick={() => sendUpvote()}
            >
              <Icon classes={{ root: classes.iconRoot }}>
                <img
                  className={classes.imageIcon}
                  src="../../../../../assets/images/applause-24.svg"
                />
              </Icon>
              {comment.upvotes}
            </Fab>
            <div>
              {comment.userid === ItemsService.getUserId() ? (
                <IconButton
                  className={classes.margin}
                  onClick={() => deleteComment()}
                >
                  <DeleteIcon />
                </IconButton>
              ) : null}
              {expanded ? (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.margin}
                  onClick={handleExpandClick}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  className={classes.margin}
                  onClick={handleExpandClick}
                >
                  Reply
                </Button>
              )}
            </div>
          </CardActions>
        ) : null}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <CreateComment
              pattern={comment.pattern}
              patternName={comment.patternName}
              isSubCommentOf={comment.name}
            />
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
};

export default SingleComment;
