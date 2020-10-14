import React, { useState, useEffect } from "react";
import "../../styles/Row.css";
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
    height: 100,
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
    paddingLeft: theme.spacing(0.25),
    paddingRight: theme.spacing(0.25),
    paddingTop: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.25),
    marginRight: theme.spacing(1),
    height: 50,
  },
}));

function Feed() {
  const [comments, setComments] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

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
  const fetchData = async function fetchData() {
    const commentsData = ItemsService.getComments();
    const clapCountFromBackend = ItemsService.getClapCount();

    commentsData.promise.then((data) => {
      let commentsArray = data.value;

      commentsGlobal = commentsArray.map((comment) => ({
        ...comment,
        profilePicture: " ",
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
        paddingBottom: "50px",
      }}
    >
      {loading && (
        <Box display="flex" p={1} bgcolor="background.paper">
          {comments.map((value, i) => (
            <Card className={classes.root} key={value.id}>
              <CardHeader
                avatar={
                  <Avatar
                    aria-label="recipe"
                    className={classes.avatar}
                    src={value.profilePicture}
                  ></Avatar>
                }
                action={
                  <IconButton aria-label="Clear">
                    <ClearIcon />
                  </IconButton>
                }
                title={value.username + " has commented on:"}
              />
              <CardContent>
                <Chip
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
              <CardActions disableSpacing></CardActions>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
}

export default Feed;
