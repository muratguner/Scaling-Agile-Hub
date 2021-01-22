import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from "@material-ui/core/Avatar";
import ItemsService from "../services/ItemsService";


const useStyles = makeStyles(theme => ({
  
  profileAvatar: {
		backgroundColor: 'white',
		color: theme.palette.primary.main,
		fontSize: 16,
		height: '35px',
		width: '35px'
	},

  userAvatar: {
    color: theme.palette.primary.main,
    fontSize: 50,
    height: "125px",
    width: "125px"
  }

  
  
}));

const ImageAvatar = props => { 
  const {showUserAvatar,loadImageLocally,image} = props;

  const [localImage, setLocalImage] = React.useState(null);
  const classes = useStyles();
  
  const [showLoader, setShowLoader] = React.useState(true);
  
  const getUserInfo = (userId, token) => {
    
    ItemsService.getPicture(userId)
      .then(data => { 
        const localImage = new Image();
        localImage.src = URL.createObjectURL(data);
        setLocalImage(data);
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(data); 
        fileReaderInstance.onload = () => {
            const base64data = fileReaderInstance.result;                
            setLocalImage(base64data);
        }
        setShowLoader(false);
      })
      .catch(error => {
        
        if (error.message === "Unauthorized") {
          setInputErrorMessage(
            "Sorry, you are not authorized to make this request."
          );
        }
      });

     
    }

      React.useEffect(() => {
        setTimeout(() => {
          const authentication = JSON.parse(localStorage.getItem("authentication"));
          if(loadImageLocally)
          {
            getUserInfo(authentication.userId, authentication.token);
          }
          
        }, 100);
      }, []);
  





  
    return ( 
    <div>
    {
      (loadImageLocally || image) ?
      <Avatar className={showUserAvatar ? classes.userAvatar : classes.profileAvatar }  src={loadImageLocally ? localImage : image } />
      :                 
      <Avatar className={showUserAvatar ? classes.userAvatar : classes.profileAvatar }>
      {JSON.parse(localStorage.getItem("authentication"))
        .user.split(/\s+/)
        .map(name => name.charAt(0))
        .join("")}
    </Avatar>
      }

  </div>  

  );
  
}



export default ImageAvatar
