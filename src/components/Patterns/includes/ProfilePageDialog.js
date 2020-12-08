import React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ItemsService from "../../../services/ItemsService";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import CircularProgress from "@material-ui/core/CircularProgress";
import ImageAvatar from "../../../components/ImageAvatar";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Brightness1Icon from "@material-ui/icons/Brightness1";

const useStyles = makeStyles((theme) => {
  const avatar = {
    marginBottom: theme.spacing(2),
    height: 50,
    width: 50,
  };

  return {
    page: {
      textAlign: "center",
      backgroundColor: "#FAFAFA",
    },
    root: {
      padding: theme.spacing(4, 4, 4, 4),
      textAlign: "center",
    },
    backDrop: {
      backdropFilter: "blur(3px)",
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(4),
    },
    submit: {
      marginTop: theme.spacing(3),
    },
    login: {
      marginTop: theme.spacing(2),
    },
    progress: {
      position: "absolute",
      top: -4,
      left: -4,
    },
    button: {
      margin: theme.spacing(1),
    },
    cancelbutton: {
      margin: theme.spacing(1),
      backgroundColor: "grey",
    },
    input: {
      display: "none",
    },
    nameStyle: {
      paddingRight: "150px",
      height: "10px",
      color: "black",
      backgroundColor: "white",
      marginTop: theme.spacing(4),
    },
    spacing: {
      marginBottom: theme.spacing(2),
    },
    loader: {
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: "-37.5px",
      marginTop: "-37.5px",
    },
    typographyStyle: {
      textAlign: "left",
      fontSize: "1.125rem",
      fontFamily: "Raleway",
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "0.0075em",
    },
    iconButton: {
      backgroundColor: "inherit !important",
    },
  };
});

const ProfilePageDialog = (props) => {
  const theme = useTheme();
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [role, setRole] = React.useState("");
  const [socialMedia, setSocialMedia] = React.useState("");
  const [renderAvatar, setRenderAvatar] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(true);
  const [reputation, setUserReputation] = React.useState(null);
  const [badgeColor, setBadgeColor] = React.useState("");

  const { open, handleDialogClose, userData } = props;

  const classes = useStyles();

  const [currentValues, setCurrentValues] = React.useState("");

  const getUserInfo = (userId, token) => {
    ItemsService.getUserInfo(userId, token)
      .then((data) => {
        setFirstName(data.name);

        setEmail(data.email);
        setRole(
          data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["role"]
                ? data.attributes[0].values[0]["role"]
                : ""
              : ""
            : ""
        );
        setAffiliation(
          data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["affiliation"]
                ? data.attributes[0].values[0]["affiliation"]
                : ""
              : ""
            : ""
        );
        setSocialMedia(
          data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["socialMedia"]
                ? data.attributes[0].values[0]["socialMedia"]
                : ""
              : ""
            : ""
        );

        setCurrentValues({
          firstName: data.name,
          email: data.email,
          affiliation: data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["affiliation"]
                ? data.attributes[0].values[0]["affiliation"]
                : ""
              : ""
            : "",
          role: data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["role"]
                ? data.attributes[0].values[0]["role"]
                : ""
              : ""
            : "",
          socialMedia: data.attributes[0]
            ? data.attributes[0].values[0]
              ? data.attributes[0].values[0]["socialMedia"]
                ? data.attributes[0].values[0]["socialMedia"]
                : ""
              : ""
            : "",
        });
      })
      .catch((error) => {
        if (error.message === "Unauthorized") {
          setInputErrorMessage(
            "Sorry, you are not authorized to make this request."
          );
        }
        setShowLoader(false);
        window.scrollTo(0, 0);
      });
  };

  const renderTextField = (label, value, badge) => {
    return (
      <Grid item xs={12} container justify="center" alignItems="center">
        <Grid xs={1} item></Grid>
        <Grid xs={5} item>
          <Typography
            variant="h6"
            gutterBottom
            className={classes.typographyStyle}
          >
            {label}
          </Typography>
        </Grid>
        <Grid xs={5} item zeroMinWidth>
          <Typography
            style={{overflowWrap: 'break-word'}}
            variant="h6"
            gutterBottom
            className={classes.typographyStyle}
          >
            {value}
            {badge && (
              <IconButton className={classes.iconButton}>
                <Brightness1Icon
                  style={{ fill: badgeColor, fontSize: "13px" }}
                ></Brightness1Icon>
              </IconButton>
            )}
          </Typography>
        </Grid>
        <Grid xs={1} item></Grid>
      </Grid>
    );
  };

  React.useEffect(() => {
    setTimeout(() => {
      setUserReputation(userData.reputation);
      setBadgeColor(userData.badgeColor);
      const authentication = JSON.parse(localStorage.getItem("authentication"));
      getUserInfo(userData.userid, authentication.token);
    }, 100);
  }, [open]);

  if (!renderAvatar) {
    return (
      <CircularProgress size={75} thickness={4} className={classes.loader} />
    );
  }

  const renderBody = () => {
    return (
      <div>
        <Dialog
          fullWidth
          open={open}
          onClose={handleDialogClose}
          BackdropProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
              backdropFilter: "blur(2px)",
            },
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <div className={classes.root}>
            <Paper>
              <Grid
                item
                container
                direction="column"
                justify="space-evenly"
                alignItems="center"
                index={0}
              >
                <form className={classes.form}>
                  <Grid item xs={12} container spacing={1}>
                    <Grid
                      className={classes.spacing}
                      item
                      xs={12}
                      container
                      justify="center"
                      alignItems="center"
                    >
                      {renderAvatar ? (
                        <ImageAvatar
                          style={{ border: 1, objectFit: "cover" }}
                          showUserAvatar={true}
                          image={userData.profilePicture}
                          loadImageLocally={false}
                        />
                      ) : null}
                    </Grid>
                    <Grid
                      className={classes.spacing}
                      item
                      xs={12}
                      container
                      justify="center"
                      alignItems="center"
                    ></Grid>
                    {renderTextField("NAME", firstName, false)}
                    {renderTextField("EMAIL ADDRESS", email, false)}
                    {renderTextField("REPUTATION", reputation, true)}
                    {renderTextField("AFFILIATION", affiliation, false)}
                    {renderTextField("ROLE", role, false)}
                    {renderTextField("SOCIAL MEDIA", socialMedia, false)}
                  </Grid>
                </form>
              </Grid>
            </Paper>
          </div>
        </Dialog>
      </div>
    );
  };

  return showLoader ? (
    <CircularProgress size={75} thickness={4} className={classes.loader} />
  ) : (
    renderBody()
  );
};
export default ProfilePageDialog;
