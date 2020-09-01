import React from 'react';
import {Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {GET_ENTITY_COLOR} from '../../../config'
import CreateOrEditPatternDialog from './CreateOrEditPatternDialog';
import CustomSnackBar from '../../CustomSnackBar';

const useStyles = makeStyles(theme => {
	return {
		root: {
			padding: theme.spacing(6, 6, 10, 6),
			textAlign: 'center'
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1)
          },
        chip: {
            margin: theme.spacing(1)
        }
	}
});

const CreatePatternsListDialog = props => {
    const { open, handleClose, data} = props;
    const [isCreatePatternDialogOpen, setIsCreatePatternDialogOpen] = React.useState(false);
    const [patternChoiceId, setPatternChoiceId] = React.useState('stakeholders');
    const [selectedPatternId,setSelectedPatternId] = React.useState('');
    const [selectedPatternName,setSelectedPatternName] = React.useState('');
    const [selectedPatternIdPrefix,setSelectedPatternIdPrefix] = React.useState('')
    const [showToast, setShowToast] = React.useState(false);
    const [formattedData, setformattedData] = React.useState({});
    const classes = useStyles();
    
    const patternChoices = [
        {name: 'Create Stakeholder', colorId: 'Stakeholders', id: "Stakeholders",patternID:'10de6jexjgxxp', patternIDPrefix:'S-'},
        {name: 'Create Concern', colorId: 'Concerns', id: "Concerns",patternID:'1unz03fc77vpq',patternIDPrefix:'C-'}, //1osrbtmwqz9pl //r5o3u1cni19c (k)
        {name: 'Create Anti Pattern', colorId: 'Anti Patterns', id: "Anti Patterns",patternID:'gjr40tsww8ll',patternIDPrefix:'A-'},
        {name: 'Create Principle', colorId: 'Principles', id: 'Principles',patternID:'q5mdskt02rme',patternIDPrefix:'P-'},
        {name: 'Create Methodology Pattern', colorId: 'Methodology Patterns', id: 'Methodology Patterns',patternID:'1vncgsz3emivs',patternIDPrefix:'M-'},
        {name: 'Create Coordination Pattern', colorId: 'Coordination Patterns', id: 'Coordination Patterns',patternID:'y41q5os827sv',patternIDPrefix:'CO-'},
        {name: 'Create Visualization Pattern', colorId: 'Visualization Patterns', id: 'Visualization Patterns',patternID:'6yr2hdx9v0t3',patternIDPrefix:'V-'}
    ]

    const handleCreatePatternDialogOpen = () => {
		setIsCreatePatternDialogOpen(true)
	}
	const handleCreatePatternDialogClose = (success) => {
        setIsCreatePatternDialogOpen(false)
        if(success)
          setShowToast(true);
    }

    const formatData = (id) => {
        setformattedData(data.flat().filter(function(x){return x.description === id})[0].data[0])
    }
    
    const handlePatternChoiceMade = (id,selectedPatternId,selectedPatternIdPrefix,selectedPatternName) => {
        setPatternChoiceId(id);
        setSelectedPatternId(selectedPatternId);
        setSelectedPatternName(selectedPatternName)
        setSelectedPatternIdPrefix(selectedPatternIdPrefix)
        handleCreatePatternDialogOpen();
        handleClose();formatData(id);
    }

	return (
        <div>
            <Dialog
            fullWidth
            maxWidth='sm'
			open={open}
			onClose={() => {
				handleClose()
			}}
		>
        <DialogTitle>
            Create Pattern
        </DialogTitle>
        <DialogContent>
            {
                patternChoices.map(object => {
                    const color = GET_ENTITY_COLOR(object.colorId)
                    return (<div><Chip className={classes.chip} onClick={() => handlePatternChoiceMade(object.id,object.patternID,object.patternIDPrefix,object.name)} label={object.name} clickable style={{backgroundColor: color}} color='primary' /></div>)
                })
            }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          </DialogActions>
		</Dialog>
        <CreateOrEditPatternDialog open={isCreatePatternDialogOpen}  handleClose={handleCreatePatternDialogClose} patternId={selectedPatternId} patternNameSelected= {selectedPatternName} patternIdPrefix={selectedPatternIdPrefix} data={formattedData} actualData = {data.flat()} type={patternChoiceId} createOrEdit={'Create'}/>
        {
          showToast ? React.createElement(
            CustomSnackBar,
            {message:"Created Successfully!"},
            
          ): null
          }
        </div>
    )
}

export default CreatePatternsListDialog;