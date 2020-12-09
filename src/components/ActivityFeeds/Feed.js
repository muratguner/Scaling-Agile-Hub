import React, { useState, useEffect } from "react";
import ItemsService from "../../services/ItemsService";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import { useHistory } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Brightness1Icon from "@material-ui/icons/Brightness1";
import StarsIcon from "@material-ui/icons/Stars";
import StarsTwoToneIcon from "@material-ui/icons/StarsTwoTone";
import LensIcon from "@material-ui/icons/Lens";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import ProfilePageDialog from "../Patterns/includes/ProfilePageDialog";

const theme = createMuiTheme({
  typography: {
    fontSize: 12,
    fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
    fontWeightLight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    justifyContent: "center",
    textAlign: "center",
    justify: "center",
    alignContent: "center",
    width: 300,
    marginLeft: 16,
  },
  card: {
    width: 300,
    height: 60,
    paddingLeft: theme.spacing(0.1),
    paddingRight: theme.spacing(0.1),
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.1),
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: "#195b8b",
  },
  chip: {
    paddingLeft: theme.spacing(0.1),
    paddingRight: theme.spacing(0.1),
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.1),
    marginRight: theme.spacing(1),
    height: 50,
  },
  box: {
    paddingLeft: theme.spacing(0.1),
    paddingRight: theme.spacing(0.1),
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.1),
  },
  cardContent: {
    paddingLeft: theme.spacing(0.1),
    paddingRight: theme.spacing(0.1),
    paddingTop: theme.spacing(0.1),
    paddingBottom: theme.spacing(0.5),
  },
  arrow: {
    color: "#D8D8D8",
  },
  tooltip: {
    backgroundColor: "#D8D8D8",
  },
}));

function Feed(props) {
  const [comments, setComments] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [userData, setUserData] = React.useState("");

  const getImage = async function getImage(id) {
    return new Promise((resolve, reject) => {
      const picData = ItemsService.getPictures(id);
      picData
        .then((data) => {
          readFile(data).then((data) => {
            setTimeout(function () {
              resolve({ userid: id, image: data });
            }, 100);
          });
        })
        .catch((error) => {
          console.log("Error");
        });
    });
  };

  const readFile = function read_file(data) {
    return new Promise((resolve, reject) => {
      let base64data;
      const fileReaderInstance = new FileReader();
      fileReaderInstance.readAsDataURL(data);
      fileReaderInstance.onload = resolve;
      fileReaderInstance.onload = () => {
        base64data = fileReaderInstance.result;
        setTimeout(function () {
          resolve(base64data);
        }, 100);
      };
    });
  };

  const removeItem = async function removeItem(index) {
    setTimeout(() => {
      commentsGlobal = comments;
      commentsGlobal.splice(index, 1);
      setComments([...commentsGlobal]);
    }, 100);
  };

  const getBadgeColor = function getBadgeColor(userid) {
    var userReputation = userReputationsMap.get(userid);
    if (userReputation >= 10 && userReputation <= 20) {
      return "#ab825f";
    } else if (userReputation > 20 && userReputation < 30) {
      return "#828282";
    } else {
      return "#f1b600";
    }
  };

  const showPattern = async function showPattern(pattern) {
    let patternType =
      (pattern.charAt(0) === "C" && "Concerns") ||
      (pattern.charAt(0) === "A" && "Anti Patterns") ||
      (pattern.charAt(0) === "M" && "Methodology Pattern") ||
      (pattern.charAt(0) === "P" && "Principles") ||
      (pattern.charAt(0) === "V" && "Visualization Pattern") ||
      (pattern.charAt(2) === "o" && "Coordination Patterns");

    history.push(`/patterns/${patternType}/${pattern}`);
  };

  const handleDialogOpen = (value) => {
    console.log(value);
    setUserData(value);
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  React.useEffect(() => {
    async function loadDataAsync() {
      try {
        await fetchData();
      } catch (e) {
        console.warn(e);
      } finally {
        setTimeout(() => {
          setLoading(true);
        }, 100);
      }
    }
    loadDataAsync();
  }, [loading]);

  const setImage = async function setImage(array, id) {
    setComments(
      (commentsGlobal = commentsGlobal.map((item) =>
        item.profilePicture === " " && item.userid === id
          ? {
              ...item,
              profilePicture:
                array[array.findIndex((obj) => obj.userid == item.userid)]
                  .image,
            }
          : item
      ))
    );
  };

  let commentsGlobal = [];
  var userReputationsMap = new Map();
  const fetchData = async function fetchData() {
    const feedbackData = ItemsService.getFeedback();
    const clapCountFromBackend = ItemsService.getClapCount();

    feedbackData.promise.then((data) => {
      let commentsArray = data.value;

      commentsArray.forEach((element) => {
        if (userReputationsMap.get(element.userid) == undefined) {
          userReputationsMap.set(element.userid, element.upvotes);
        } else {
          var currentReputation = userReputationsMap.get(element.userid);
          userReputationsMap.set(
            element.userid,
            parseInt(element.upvotes) + parseInt(currentReputation)
          );
        }
      });

      commentsGlobal = commentsArray.map((comment) => ({
        ...comment,
        profilePicture: " ",
        badgeColor: getBadgeColor(comment.userid),
        reputation: userReputationsMap.get(comment.userid),
      }));

      let bufferArray = [];
      commentsGlobal.forEach((element) => {
        getImage(element.userid).then((data) => {
          bufferArray.push(data);
          setImage(bufferArray, element.userid);
        });
      });
    });

    clapCountFromBackend.promise.then((data) => {
      //console.log(data.value);
    });
  };

  return (
    <div
      style={{
        overflowY: "hidden",
        overflowX: "scroll",
        display: "flex",
        paddingBottom: "20px",
        paddingTop: "4px",
      }}
    >
      {loading && (
        <Box
          display="flex"
          p={1}
          className={classes.box}
          bgcolor="background.paper"
        >
          {comments.map(
            (value, i) =>
              (value.isSubCommentOf === undefined ||
                value.isSubCommentOf === null) && (
                <Card className={classes.root} key={value.id}>
                  <CardHeader
                    avatar={
                      <Avatar
                        onClick={() => handleDialogOpen(value)}
                        style={{cursor: "pointer"}}
                        aria-label="recipe"
                        className={classes.avatar}
                        src={value.profilePicture}
                      ></Avatar>
                    }
                    action={
                      <IconButton
                        aria-label="Clear"
                        onClick={() => {
                          removeItem(i);
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    }
                    title={value.username + " has rated on:"}
                  />
                  <CardContent className={classes.cardContent}>
                    <Chip
                      onClick={() => {
                        showPattern(value.pattern);
                      }}
                      className={classes.chip}
                      avatar={
                        <Avatar
                          style={{
                            color: "white",
                            height: "40px",
                            width: "40px",
                            backgroundColor:
                              (value.pattern.charAt(0) === "C" && "#f29b30") ||
                              (value.pattern.charAt(0) === "A" && "#e74c3c") ||
                              (value.pattern.charAt(0) === "M" && "#3498db") ||
                              (value.pattern.charAt(0) === "P" && "#34495e") ||
                              (value.pattern.charAt(0) === "V" && "#4eba6f") ||
                              (value.pattern.charAt(2) === "o" && "#e74c3c"),
                          }}
                        >
                          {value.pattern}
                        </Avatar>
                      }
                      label={value.patternName.substring(0, 30)}
                    />
                  </CardContent>
                  <div>
                    <StarRatingComponent
                      name="rating"
                      starCount={5}
                      value={value.star}
                      starColor={"#195b8b"}
                      emptyStarColor={"#cecece"}
                    />
                  </div>
                  <CardActions disableSpacing></CardActions>
                </Card>
              )
          )}
        </Box>
      )}
      <ProfilePageDialog
        open={dialogOpen}
        handleDialogClose={handleDialogClose}
        userData={userData}
      />
    </div>
  );
}

export default Feed;
