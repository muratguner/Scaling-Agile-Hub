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
import CommentIcon from "@material-ui/icons/Comment";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    justifyContent: "center",
    textAlign: "center",
    justify: "center",
    alignContent: "center",
    width: 300,
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
  const [commentsData, setComments] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    async function fetchData() {
      const commentsData = ItemsService.getComments();
      commentsData.promise.then((data) => {
        setComments(data.value);
      });
      return commentsData;
    }
    fetchData();
  }, [commentsData]);

  return (
    <div
      style={{
        overflowY: "hidden",
        overflowX: "scroll",
        display: "flex",
        paddingBottom: "50px",
      }}
    >
      <Box display="flex" p={1} bgcolor="background.paper">
        {commentsData.map((value) => (
          <Card className={classes.root} key={value.id}>
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                  {value.username.charAt(0)}
                </Avatar>
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
    </div>
  );
}

export default Feed;
