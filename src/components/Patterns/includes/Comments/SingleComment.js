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
import StarRatingComponent from "react-star-rating-component";
import ProfilePageDialog from "../ProfilePageDialog"

var dateFormat = require("dateformat");

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
    rating: {
      paddingLeft: "15px",
    },
  };
});

const SingleComment = (props) => {
  const [comment, setComment] = React.useState({ ...props.comment });
  const { comments } = props;

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [userData, setUserData] = React.useState("");

  React.useEffect(() => {
    setComment(comment);
  }, [comment]);

  const sendUpvote = () => {
    var returned = ItemsService.upvoteFeedback(
      comment.id,
      comment.name,
      comment.comment,
      comment.isSubCommentOf,
      comment.pattern,
      comment.patternName,
      comment.star,
      comment.timestamp,
      `${parseInt(comment.upvotes) + 1}`,
      comment.userid,
      comment.username
    );
    returned.then((data) => {
      setDisabled(true);
      setComment({ ...comment, upvotes: parseInt(comment.upvotes) + 1 });
    });
  };

  const deleteComment = () => {
    props.reloadStart(true);
    var returned = ItemsService.deleteFeedback(comment.id);
    returned.then((data) => {
      props.callBack("reload" + Math.random().toString(36).substring(7));
    });
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const getQuotedComment = () => {
    var a = comments.filter(function (feedback, index) {
      return feedback.name === comment.isSubCommentOf;
    });
    if (a.length > 0) {
      return "<strong>Replying to: </strong>" + a[0].comment;
    }
  };

  const handleDialogOpen = (value) => {
    console.log(value);
    setUserData(value);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div className={classes.singleCommentRoot}>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              onClick={() => handleDialogOpen(comment)}
              style={{cursor: "pointer"}}
              aria-label="recipe"
              className={classes.avatar}
              src={comment.profilePicture}
            ></Avatar>
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
              {dateFormat(
                new Date(parseInt(comment.timestamp)),
                "dddd, mmmm dS, yyyy, h:MM TT"
              )}
            </Typography>
          }
        />
        {(comment.isSubCommentOf === undefined ||
          comment.isSubCommentOf === null) && (
          <div className={classes.rating}>
            <StarRatingComponent
              name="rating"
              starCount={5}
              value={comment.star}
              starColor={"#195b8b"}
              emptyStarColor={"#cecece"}
            />
          </div>
        )}

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
              disabled={disabled}
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
              reloadStart={props.reloadStart}
              callBack={props.callBack}
              commentOnly={true}
              pattern={comment.pattern}
              patternName={comment.patternName}
              isSubCommentOf={comment.name}
            />
          </CardContent>
        </Collapse>
      </Card>
      <ProfilePageDialog
        open={dialogOpen}
        handleDialogClose={handleDialogClose}
        userData={userData}
      />
    </div>
  );
};

export default SingleComment;
