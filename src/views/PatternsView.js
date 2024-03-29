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
  const [reload, setReload] = React.useState("");

  const handleSetData = (data) => {
    setData(data);
  };

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

  let commentsGlobal = [];
  var userReputationsMap = new Map();
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
  }, [reload]);

  if (loading) {
    return (
      <CircularProgress size={75} thickness={4} className={classes.loader} />
    );
  }

  return (
    <div className={classes.root}>
      <PatternViewComponent
        history={history}
        data={data}
        comments={comments}
        callBack={setReload}
      />

      <Footer />
    </div>
  );
};

export default PatternsView;
