import React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Footer from "../components/Footer";
import ItemsService from "../services/ItemsService";
import Header from "../components/Header";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import CircularProgress from '@material-ui/core/CircularProgress';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ImageAvatar from '../components/ImageAvatar'
import CustomSnackBar from '../components/CustomSnackBar';
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles(theme => {
  const avatar = {
    marginBottom: theme.spacing(2),
    height: 50,
    width: 50
  };

  return {
    page: {
      textAlign: "center",
      backgroundColor: "#FAFAFA"
    },
    root: {
     padding: theme.spacing(8, 6, 0, 6),
      textAlign: "center"
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(8)
    },
    submit: {
      marginTop: theme.spacing(3)
    },
    login: {
      marginTop: theme.spacing(2)
    },
    progress: {
      position: "absolute",
      top: -4,
      left: -4
    },
    button: {
      margin: theme.spacing(1)
    },
    cancelbutton: {
      margin: theme.spacing(1),
      backgroundColor: 'grey'
    },
    input: {
      display: "none"
    },
    nameStyle: {
      paddingRight: "150px",
      height: "10px",
      color: "black",
      backgroundColor: "white",
      marginTop: theme.spacing(4)
    },
    spacing:{
      marginBottom : theme.spacing(2)
    },
    loader:{
      position: 'absolute',
      left: '50%',
      top: '50%',
      marginLeft: '-37.5px',
      marginTop: '-37.5px'
    },
    typographyStyle:{
      textAlign:"left",
      fontSize: "1.125rem",
      fontFamily: "Raleway",
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0.0075em'
    }
  };
});

const ProfilePage = props => {
  const { history } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [selected, setSelected] = React.useState(0);
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [affiliation, setAffiliation] = React.useState("");
  const [role, setRole] = React.useState("");
  const [socialMedia, setSocialMedia] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [imageToast, setImageToast] = React.useState(false);
  const [editForm, setEditForm] = React.useState(false);
  const [inputErrorMessage, setInputErrorMessage] = React.useState();
  const [renderAvatar, setRenderAvatar] = React.useState(true);
  const [showLoader, setShowLoader] = React.useState(true);
  const [image, setImage] = React.useState(null);


  const [currentValues, setCurrentValues] = React.useState("");
  
  const validateInput = () => {
    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
        email
      )
    ) {
      throw Error("Email address is not valid.");
    }
    if (!selected && firstName === "") {
      throw Error("Name must be given.");
    }
    if(
      !/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(
        socialMedia
      )
    ){
      throw Error("Social Media link is not valid.");
    }
    
  };

 const getUserInfo = (userId, token) => {   
    window.scrollTo(0, 0);
    ItemsService.getUserInfo(userId, token)
      .then(data => {

        setFirstName(data.name);
        
        setEmail(data.email);
        setRole(data.attributes[0]? 
          (data.attributes[0].values[0]? (data.attributes[0].values[0]["role"]? data.attributes[0].values[0]["role"]: "") : "") 
          : "");
        setAffiliation(data.attributes[0]? 
          (data.attributes[0].values[0]? (data.attributes[0].values[0]["affiliation"]? data.attributes[0].values[0]["affiliation"]: "") : "") 
          : "");
        setSocialMedia(data.attributes[0]? 
          (data.attributes[0].values[0]? (data.attributes[0].values[0]["socialMedia"]? data.attributes[0].values[0]["socialMedia"]: "") : "") 
          : "");

          setCurrentValues({
            "firstName": data.name,
            "email": data.email,
            "affiliation": data.attributes[0]? 
            (data.attributes[0].values[0]? (data.attributes[0].values[0]["affiliation"]? data.attributes[0].values[0]["affiliation"]: "") : "") 
            : (""),
            "role": data.attributes[0]? 
            (data.attributes[0].values[0]? (data.attributes[0].values[0]["role"]? data.attributes[0].values[0]["role"]: "") : "") 
            : (""),
            "socialMedia":data.attributes[0]? 
            (data.attributes[0].values[0]? (data.attributes[0].values[0]["socialMedia"]? data.attributes[0].values[0]["socialMedia"]: "") : "") 
            : ("")

          });

         
            ItemsService.getPicture(userId)
              .then(data => { 
                const image = new Image();
                image.src = URL.createObjectURL(data);
                setImage(data);
                const fileReaderInstance = new FileReader();
                fileReaderInstance.readAsDataURL(data); 
                fileReaderInstance.onload = () => {
                    const base64data = fileReaderInstance.result;                
                    setImage(base64data);
                }
                setShowLoader(false);
                window.scrollTo(0, 0);
              })
              .catch(error => {
                
                if (error.message === "Unauthorized") {
                  setInputErrorMessage(
                    "Sorry, you are not authorized to make this request."
                  );
                }
              });
        
             
        
          
      })
      .catch(error => {
        if (error.message === "Unauthorized") {
          setInputErrorMessage(
            "Sorry, you are not authorized to make this request."
          );
        }
       setShowLoader(false);
       window.scrollTo(0, 0);
      });

      
      
  };

  const handleCapture = ({ target }) => {
    const fileReader = new FileReader();
    const authentication = JSON.parse(localStorage.getItem("authentication"));
    fileReader.readAsDataURL(target.files[0])
    fileReader.onload = (e) => {
        setRenderAvatar(false);
        
        const formData = new FormData();
        formData.append("picture",target.files[0]);
        ItemsService.uploadPicture(authentication.userId,formData);

        document.location.reload();


        setTimeout(
          () => {
            setRenderAvatar(true);   
            setTimeout(
              () => {
                setImageToast(true);
              }
              ,
              1000
          ); 
          setImageToast(false);
          window.scrollTo(0, 0);  
          }
          ,
          1000
      );  
    };
  };


  const handleChange = event => {
    switch (event.target.name) {
      case "firstName":
        setFirstName(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      case "role":
        setRole(event.target.value);
        break;
      case "affiliation":
        setAffiliation(event.target.value);
        break;
      case "socialMedia":
        setSocialMedia(event.target.value);
        break;
      default:
        break;
    }
  };

  const enableShowLoader = () => {
    setTimeout(
        () => {
          setRenderAvatar(true);
          setTimeout(
            () => {
              setShowToast(true);
            }
            ,
            1000
        );
        setShowToast(false);
        window.scrollTo(0, 0);
        }
      ,
      1000
  );
  }

  

  const handleSaveClick = () => {
    try {
      window.scrollTo(0, 0);
      setInputErrorMessage("");
      validateInput();
      setRenderAvatar(false);
      setEditForm(false);

      const authentication = JSON.parse(localStorage.getItem("authentication"));
      ItemsService.updateUser(
        authentication.userId,
        firstName,
        role,
        affiliation,
        socialMedia
      );

      setCurrentValues({
        "firstName": firstName,
        "email": email,
        "affiliation": affiliation,
        "role": role,
        "socialMedia": socialMedia
      });

      enableShowLoader();

    } catch (error) {
      setInputErrorMessage(error.message);
    }  
  };

  const handleCancelClick = () => {
    

    setFirstName(currentValues["firstName"]);
    setEmail(currentValues["email"]);
    setAffiliation(currentValues["affiliation"]);
    setRole(currentValues["role"]);
    setSocialMedia(currentValues["socialMedia"]);

    console.log(currentValues);

    setEditForm(false);
  };



  const renderTextField = (label, value, fieldName, disabled,required) => {
    return !editForm ? (<Grid item xs={12} container justify="center" alignItems="center">
    <Grid xs={3} item> </Grid>
    <Grid xs={2} item>
     <Typography variant="h6" gutterBottom className={classes.typographyStyle}>
      {label}
      </Typography>
    </Grid>
    <Grid xs={5} item>
    <Typography variant="h6" gutterBottom className={classes.typographyStyle}>
       {value}
      </Typography>
    </Grid>
    </Grid>):
    (<Grid item xs={12} container justify="center" alignItems="center">
    <Grid xs={5} item>
      <TextField
        InputLabelProps={{
          style: { color: theme.palette.secondary.main }
        }}
        name={fieldName}
        variant="outlined"
        required={required}
        fullWidth
        id={fieldName}
        label={label}
        disabled={disabled}
        onChange={handleChange}
        value={value}
      />
    </Grid>
    </Grid>) }
  
  React.useEffect(() => {
    setTimeout(() => {
      const authentication = JSON.parse(localStorage.getItem("authentication"));
      getUserInfo(authentication.userId, authentication.token);

    }, 100);

  }, []);

  if(!renderAvatar) {
    return <CircularProgress size={75} thickness={4} className={classes.loader} />
   }

   const renderBody = () => {
    return (<div className={classes.page}>            
      <Header history={history} /> 
      <div className={classes.root}>
      <Paper >
        <Grid
          item
          container
          direction="column"
          justify="space-evenly"
          alignItems="center"
          index={0}
        >
          <form className={classes.form} onSubmit={handleSaveClick} >
            <Grid item xs={12} container spacing={2}>
              <Grid className={classes.spacing} item xs={12} container justify="center" alignItems="center">
                {
                  renderAvatar ?
                  <ImageAvatar style={{border: 1, objectFit: 'cover'}} showUserAvatar={true} image={image} loadImageLocally={false} /> : null
                }
              </Grid>
              <Grid className={classes.spacing} item xs={12} container justify="center" alignItems="center">
              <Button
              variant="contained"
              component="label"
              color="primary"
              className={classes.button}
              startIcon={<CloudUploadIcon />
              }
              >
              Upload Picture
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleCapture}
              />
            </Button>
            </Grid>
              {renderTextField('NAME',firstName,'firstName',false,true)}
              {renderTextField('EMAIL ADDRESS',email,'email',true,true)}
              {renderTextField('AFFILIATION',affiliation,'affiliation',false,false)}
              {renderTextField('ROLE',role,'role',false,false)}
              {renderTextField('SOCIAL MEDIA',socialMedia,'socialMedia',false,false)}
              <Grid item xs={12} container justify="center" alignItems="center">
                    {
                      !editForm ?
                      (
                        <Button
                       autoFocus
                       onClick={() => {setEditForm(true)}}
                       color="primary"
                       variant="contained"
                       className={classes.button}
                     >
                       Edit Profile
                     </Button>)
                      :
                      (
                      <div>
                      <Button 
                       onClick={handleSaveClick}
                       color="primary"
                       variant="contained"
                       className={classes.button}
                     >
                       Save Changes
                     </Button>

                      <Button 
                      onClick={handleCancelClick}
                      color="primary"
                      variant="contained"
                      className={classes.cancelbutton}
                      >
                      Cancel
                      </Button>
                      </div>
                     )
                    }    
              </Grid>
              <Grid item xs={12}>
                <Typography
                  color="error"
                  style={{ display: inputErrorMessage ? "block" : "none" }}
                >
                  {inputErrorMessage}
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Grid>
        {
          showToast ? React.createElement(
            CustomSnackBar,
            {message:"Saved Successfully!"},
            
          ): ""
        }
        {
          imageToast ? React.createElement(
            CustomSnackBar,
            {message:"Image Uploaded Successfully!"},
            
          ): ""
        }
      </Paper>
      </div>
      <Footer />
      </div>)
   }


  return (
    showLoader ?
    <CircularProgress size={75} thickness={4} className={classes.loader} />
    :
    renderBody()
    );
};
export default ProfilePage;
