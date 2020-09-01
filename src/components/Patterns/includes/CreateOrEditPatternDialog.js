import React from 'react';
import {TextField,Button, Dialog, DialogActions,DialogContent, DialogTitle, Divider, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton,Menu,Chip,Select, InputLabel, MenuItem, Typography} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DoneIcon from '@material-ui/icons/Done';
import ItemsService from '../../../services/ItemsService'
import makeStyles from '@material-ui/core/styles/makeStyles';
import FilterIcon from '@material-ui/icons/FilterListRounded'
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import RichTextEditor from 'react-rte';
import Avatar from '@material-ui/core/Avatar';
import 'core-js-pure/stable';
import 'regenerator-runtime/runtime';
import {GET_ENTITY_COLOR} from '../../../config';

import CustomSnackBar from '../../CustomSnackBar';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import ImageResize from 'quill-image-resize-module-react';
Quill.register('modules/ImageResize', ImageResize);


const useStyles = makeStyles(theme => {
	return {
        form: {
            display: 'flex',
            flexDirection: 'column'
        },
        richTextEditor: {
            marginBottom: theme.spacing(1),
            fontFamily: theme.typography.fontFamily,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        patternChips:{
            margin:'5px',
        },
        selectTitle:
        {
        color: 'black',
        position: 'relative',
        top: '-1px'
        },
        uploadPatternsImage:{
          marginLeft: '20px'
        },
        imageUploadedChip:{
          marginLeft:'24px'
        },
        uploadedImageURL:{
          visibility:'hidden'
        },
        copyicon:{
          backgroundColor:'#fff',
          height:'25px'
        },
      
	}
});

const CreateOrEditPatternDialog = props => {

  const { open, handleClose, data, createOrEdit, actualData, type,patternId,patternIdPrefix,patternNameSelected} = props;
  const classes = useStyles();
   

  // Quill Editor BEGIN
  
  const richTextBlacklist = [
    'Methodology Patterns',
    'Coordination Patterns',
    'Visualization Patterns'
  ];
  const dataFilter = ['id'];
  var initialStateArray = Array(25).fill("");
  var requiredElementsIndex = [];
  
  if(createOrEdit === 'Edit') {
    initialStateArray = [];
    Object.keys(data).filter(key => !dataFilter.includes(key)).map((key,index) => {
      initialStateArray.push(Array.isArray(data[key]) && data[key].length >0 && data[key][0].length >0 ? data[key][0].replace("[\"","").replace("\"]","") : Array.isArray(data[key]) && data[key].length < 0 ? "" : data[key]);
      if(key ==="name"){
        requiredElementsIndex.push(index)
      }
      else if(key === "identifier"){
        requiredElementsIndex.push(index)
      }
    });
  }
  
  const [editorStateArray, setEditorStateArray] = React.useState(initialStateArray);
  const updateRichFields = (index) => e => {
    
    let newStateArray = [...editorStateArray];
    newStateArray[index] = e;
    setEditorStateArray(newStateArray);
  }

  const [expanded, setExpanded] = React.useState(Object.keys(data).map((value, index) => index === 0? index : -1))

	const handlePanelChange = index => () => {
		setExpanded(expanded.indexOf(index) !== -1 ? expanded.filter(item => item !== index) : [...expanded, index])
	}
  // Rich Text END

  const [showToast, setShowToast] = React.useState(false);
  var requiredFieldIndex =[ Object.keys(data).indexOf("name"),Object.keys(data).indexOf("id")]
 

  const [filterAnchorElMPattern, setFilterAnchorElMPattern] = React.useState(undefined)
  const [filterAnchorElCPattern, setFilterAnchorElCPattern] = React.useState(undefined)
  const [filterAnchorElVPattern, setFilterAnchorElVPattern] = React.useState(undefined)
  const [filterAnchorElConcern, setFilterAnchorElConcern] = React.useState(undefined)
  const isFilterMenuOpenMPattern = Boolean(filterAnchorElMPattern)
  const isFilterMenuOpenCPattern = Boolean(filterAnchorElCPattern)
  const isFilterMenuOpenVPattern = Boolean(filterAnchorElVPattern)
  const isFilterMenuOpenConcern = Boolean(filterAnchorElConcern)

  const [methodology, setMethodology] = React.useState("");
  const [coordination, setCoordination] = React.useState("");
  const [visualization, setVisualization] = React.useState("");
  const [concern, setConcern] = React.useState("");

  const [methodologyPattern,setMethodologyPattern] = React.useState(createOrEdit === "Edit" ? data["methodologyPatterns"] && data["methodologyPatterns"].map(x => x.identifier+ ' - '+ x.name) :[]);
  const [coordinationPattern,setCoordinationPattern] = React.useState(createOrEdit === "Edit" ? data["coordinationPatterns"] && data["coordinationPatterns"].map(x => x.identifier+ ' - '+ x.name) :[]);
  const [visualizationPattern,setVisualizationPattern] = React.useState(createOrEdit === "Edit" ? data["visualizationPatterns"] && data["visualizationPatterns"].map(x => x.identifier+ ' - '+ x.name) :[]);
  const [existingConcern, setExistingConcern] = React.useState(createOrEdit === "Edit" ? data["concerns"] && data["concerns"].map(x => x.identifier+ ' - '+ x.name) :[]);
   var patternsIds = {}
   var patternsArray =actualData.filter(function(x){ return x.description.includes("Patterns") || x.description.includes("Concerns")});
   for(var i=0;i<patternsArray.length;i++){
     for(var j=0;patternsArray[i] && j<patternsArray[i].data.length;j++){
      patternsIds[patternsArray[i].data[j].identifier+ ' - '+  patternsArray[i].data[j].name] = patternsArray[i].data[j].id;}
   }
   const [methodologyPatternIds,setMethodologyPatternIds] = React.useState(createOrEdit === "Edit" ? data["methodologyPatterns"] && data["methodologyPatterns"].map(x => patternsIds[x.identifier+ ' - '+ x.name]) :[]);
   const [coordinationPatternIds,setCoordinationPatternIds] = React.useState(createOrEdit === "Edit" ? data["coordinationPatterns"] && data["coordinationPatterns"].map(x => patternsIds[x.identifier+ ' - '+ x.name]) :[]);
   const [visualizationPatternIds,setVisualizationPatternIds] = React.useState(createOrEdit === "Edit" ? data["visualizationPatterns"] && data["visualizationPatterns"].map(x => patternsIds[x.identifier+ ' - '+ x.name]) :[]);
   const [concernIds,setConcernIds] = React.useState(createOrEdit === "Edit" ? data["concerns"] && data["concerns"].map(x => patternsIds[x.identifier+ ' - '+ x.name]) :[]);

 
  const [methodologyOptions, setMethodologyOptions] = React.useState(createOrEdit === "Edit" ? actualData.filter(function(x){ return x.description === "Methodology Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name).filter(f => methodologyPattern && !methodologyPattern.includes(f)): actualData.filter(function(x){ return x.description === "Methodology Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name));
  const [coordinationOptions, setCoordinationOptions] = React.useState(createOrEdit === "Edit" ? actualData.filter(function(x){ return x.description === "Coordination Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name).filter(f => coordinationPattern && !coordinationPattern.includes(f)): actualData.filter(function(x){ return x.description === "Coordination Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name));
  const [visualizationOptions, setVisualizationOptions] = React.useState(createOrEdit === "Edit" ? actualData.filter(function(x){ return x.description === "Visualization Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name).filter(f => visualizationPattern && !visualizationPattern.includes(f)): actualData.filter(function(x){ return x.description === "Visualization Patterns"})[0].data.map(x => x.identifier+ ' - '+ x.name));
  const [concernOptions, setConcernOptions] = React.useState(createOrEdit === "Edit" ? actualData.filter(function(x){ return x.description === "Concerns"})[0].data.map(x => x.identifier+ ' - '+ x.name).filter(f => existingConcern && !existingConcern.includes(f)): actualData.filter(function(x){ return x.description === "Concerns"})[0].data.map(x => x.identifier+ ' - '+ x.name));

  const pattern = {
    methodologyPatterns :  [methodologyOptions,methodologyPattern,methodologyPatternIds,setMethodologyPattern,filterAnchorElMPattern,isFilterMenuOpenMPattern],
    visualizationPatterns : [visualizationOptions,visualizationPattern,visualizationPatternIds,setVisualizationPattern,filterAnchorElVPattern,isFilterMenuOpenVPattern],
    coordinationPatterns : [coordinationOptions,coordinationPattern,coordinationPatternIds,setCoordinationPattern,filterAnchorElCPattern,isFilterMenuOpenCPattern],
    concerns: [concernOptions,existingConcern,concernIds,setExistingConcern,filterAnchorElConcern,isFilterMenuOpenConcern]
  }

  const handleFilterMenuClose = () => {
    setFilterAnchorElMPattern(undefined)
    setFilterAnchorElCPattern(undefined)
    setFilterAnchorElVPattern(undefined)
    setFilterAnchorElConcern(undefined)
	}

	const handleFilterMenuOpen = event => {
    if(event.currentTarget.classList.contains('methodologyPatterns'))
     setFilterAnchorElMPattern(event.currentTarget)
    else if(event.currentTarget.classList.contains('coordinationPatterns'))
    setFilterAnchorElCPattern(event.currentTarget)
    else if(event.currentTarget.classList.contains('visualizationPatterns'))
    setFilterAnchorElVPattern(event.currentTarget)
    else
    setFilterAnchorElConcern(event.currentTarget)
	}

  const handleSelectChange = (event,item) => {
    if(event.target.closest('.methodologyPatterns')){
      const name = 'methodologyPatterns'
      const methodology = event.target.innerText
      setMethodology(methodology)
      setMethodologyPattern([...methodologyPattern, methodology])
      setMethodologyPatternIds([...methodologyPatternIds,patternsIds[methodology]])
      removePatternFromDropDown(name,methodology)
    }
    else if(event.target.closest('.coordinationPatterns')){
      const name = 'coordinationPatterns'
      const coordination = event.target.innerText
      setCoordination(coordination)
      setCoordinationPattern([...coordinationPattern, coordination])
      setCoordinationPatternIds([...coordinationPatternIds,patternsIds[coordination]])
      removePatternFromDropDown(name,coordination)
    }
    else if(event.target.closest('.visualizationPatterns')){
      const name = 'visualizationPatterns'
      const visualization = event.target.innerText
      setVisualization(visualization);
      setVisualizationPattern([...visualizationPattern, visualization])
      setVisualizationPatternIds([...visualizationPatternIds,patternsIds[visualization]])
      removePatternFromDropDown(name,visualization)
    }
    else{
      const concern = event.target.innerText
      setConcern(concern);
      setExistingConcern([...existingConcern, concern])
      setConcernIds([...concernIds,patternsIds[concern]])
      removePatternFromDropDown("concern",concern)
    }
  };  

  const removePatternFromDropDown = (name,pattern) => {
  if(name === "visualizationPatterns") 
  setVisualizationOptions(visualizationOptions.filter(x => !pattern.includes(x)))
  else if (name === "concern")
  setConcernOptions(concernOptions.filter(x => !pattern.includes(x)))
  else if (name === "coordinationPatterns")
  setCoordinationOptions(coordinationOptions.filter(x => !pattern.includes(x)))
  else
  setMethodologyOptions(methodologyOptions.filter(x => !pattern.includes(x)))
  }
  

  const handleSubmit = (event,data,handleClose) => {
    // Pass the state values from the form (modified input values)
    var data = data;
    var handleClose = handleClose;
    //Creating the attribute values for the pattern
    var arr = [];
    var patternApiKeyValue = patternIdPrefix === 'M-'  ? {
        visualizationPatterns : "utilizes (V-Pattern)",
        coordinationPatterns : "utilizes (CO-Pattern)",
        methodologyPatterns : "uses results of (M-Pattern)",
        concerns:"concern"
        } : ['CO-','P-'].includes(patternIdPrefix) ? {
          visualizationPatterns : "utilizes (V-Pattern)",
          coordinationPatterns : "utilizes (CO-Pattern)",
          methodologyPatterns : "utilizes (M-Pattern)",
          concerns:"concern"
        } : {
          visualizationPatterns : "is addressed by (V-Pattern)",
        coordinationPatterns : "is addressed by (C-Pattern)",
        methodologyPatterns : "is addressed by (M-Pattern)",
        concerns:"concern"

        }
        var name = '';
    var attributes = Object.keys(data).filter(prop => !['id'].includes(prop)).map((obj,index) => {
        var valuesObj = {}
        
        if(['coordinationPatterns','visualizationPatterns','methodologyPatterns','concerns'].includes(obj) && pattern[obj] && pattern[obj][1].length>0) {
          var patternName = pattern[obj][1];
          var patternIds = pattern[obj][2]
          valuesObj.name = patternApiKeyValue[obj];
          valuesObj.values = [];
          for(var i=0;i<pattern[obj][1].length;i++){
              var patternValues = {
              name: patternName[i],
              id: patternIds[i]
              }
              valuesObj.values.push(patternValues);
          }
        }
        else {
            
            // if(obj === 'identifier'){
            //   valuesObj.name = obj
            //   valuesObj.values = !Array.isArray(data[obj]) ? [data[obj]] : (data[obj]) != null ? data[obj]: [];
            // }
             if(obj === 'name'){
              name = editorStateArray[index].toString('html');
            }
            else{
              valuesObj.name = obj
              valuesObj.values = editorStateArray[index] && [editorStateArray[index].toString('html')];
              // if(obj === 'solution'){
              //   valuesObj.name = 'solution image id';
              //   valuesObj.values = imageUploadedId;
                
              // }
            }
        }
        //valuesObj.values = !Array.isArray(data[obj]) ? [data[obj]] : (data[obj]) != null ? data[obj]: [];
        return valuesObj  
    })
    //Remove name from the payload
    attributes = attributes.filter(value => Object.keys(value).length !== 0);
    
    //Strip html tags from the name attribute
    if(name.length>0)
      name = name.replace(/<\/?[^>]+(>|$)/g, "");

    var identifierIndex = attributes.map(value => value.name).indexOf('identifier');
    attributes[identifierIndex].values[0] = attributes[identifierIndex].values[0].replace(/<\/?[^>]+(>|$)/g, "");
    
    var initialStateArray = Array(25).fill(RichTextEditor.createValueFromString("", 'html'));
    if(createOrEdit === 'Edit') {
      ItemsService.editPattern(data.id,name,attributes).then(data => {
        handleClose(true);
        var index = data.attributes.map(val => {return val.name;}).indexOf('identifier');
        var patternIdentifier = data.attributes[index].values[0]
        setTimeout(function(){
          window.location.href = window.location.origin+"/#/patterns/"+type+"/"+patternIdentifier
          window.location.reload();
        },2000)  
    })}
    
    else{
    
      var attributes  = attributes.filter(value => { if(value.values !== "") return value})
      if(patternIdPrefix === 'A-'){
        var index = attributes.map(val => {return val.name;}).indexOf('revisedSolution');
        if(index>-1)
        attributes[index].name = 'revised solution';
      }
    ItemsService.createPattern(patternId,name,attributes).then(data => {
        handleClose(true);
        setEditorStateArray(initialStateArray);
        setMethodologyPattern([])
        setCoordinationPattern([])
        setVisualizationPattern([])
       
        var index = data.attributes.map(val => {return val.name;}).indexOf('identifier');
        var patternIdentifier = data.attributes[index].values[0]
        setTimeout(function(){
           window.location.href = window.location.href+"/"+type+"/"+patternIdentifier
        window.location.reload();
        },2000)  
       
    })}
  }



  const handleDelete = (event) => {
    if (event.target.closest('.methodologyPatterns')){
        var patternSelected = event.target.closest('.methodologyPatterns').getElementsByClassName('MuiChip-label')[0].innerText
        var patternPosition = methodologyPattern.indexOf(patternSelected);
        methodologyPatternIds.splice(patternPosition,1);
        methodologyPattern.splice(patternPosition,1);
        setMethodologyPattern(methodologyPattern)
        setMethodologyPatternIds(methodologyPatternIds)
        setMethodologyOptions([...methodologyOptions,patternSelected]);
    }
    else if(event.target.closest('.coordinationPatterns')){
        var patternSelected = event.target.closest('.coordinationPatterns').getElementsByClassName('MuiChip-label')[0].innerText
        var patternPosition = coordinationPattern.indexOf(patternSelected);
        coordinationPatternIds.splice(patternPosition,1);
        coordinationPattern.splice(patternPosition,1);
        setCoordinationPattern(coordinationPattern)
        setCoordinationPatternIds(coordinationPatternIds)
        setCoordinationOptions([...coordinationOptions,patternSelected]);
    }
    else if(event.target.closest('.visualizationPatterns')){
      var patternSelected = event.target.closest('.visualizationPatterns').getElementsByClassName('MuiChip-label')[0].innerText
        var patternPosition = visualizationPattern.indexOf(patternSelected);
        visualizationPatternIds.splice(patternPosition,1)
        visualizationPattern.splice(patternPosition,1);
        setVisualizationPattern(visualizationPattern)
        setVisualizationPatternIds(visualizationPatternIds)
        setVisualizationOptions([...visualizationOptions,patternSelected]);
    }
    else{
      var patternSelected = event.target.closest('.concern').getElementsByClassName('MuiChip-label')[0].innerText
        var patternPosition = existingConcern.indexOf(patternSelected);
        concernIds.splice(patternPosition,1)
        existingConcern.splice(patternPosition,1);
        setExistingConcern(existingConcern)
        setConcernIds(concernIds)
        setConcernOptions([...concernOptions,patternSelected]);
    }
    
  };


	return (
		<Dialog
      fullWidth
      maxWidth='lg'
			open={open}
			onClose={() => {
				handleClose(false)
			}}
		>
        
        {createOrEdit === 'Create'? <DialogTitle id="form-dialog-title">{patternNameSelected}</DialogTitle> : <DialogTitle id="form-dialog-title">Edit Pattern for {data.name} </DialogTitle>}
        <DialogContent>
        <div className={classes.form}>
        {
          showToast ? React.createElement(
            CustomSnackBar,
            {message:"Copied to clipboard"},
            
          ): null
          }
        {data === undefined? null : createOrEdit === 'Edit' ?
        Object.keys(data).filter(key => !dataFilter.includes(key)).map((key, index) => {
          if (true) {
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
            if(key.includes('Patterns') || key.includes('concern')){
              return (
                <ExpansionPanel key={index} expanded={expanded.indexOf(index) !== -1} onChange={handlePanelChange(index)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                <Typography variant='h6'>{title}</Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails key={index} style={{ display: 'block' }}>
                <div>
                  
                  <IconButton
                    className= {key}
                    aria-label='show filter menu'
                    aria-controls={'filter-menu'}
                    aria-haspopup='true'
                    onClick={handleFilterMenuOpen}
                    color='inherit'
                  >
                    <FilterIcon fontSize='large' color='secondary' />
                  </IconButton>
                  <Menu
                   className={key}
                    anchorEl={pattern[key][4]}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={pattern[key][5]}
                    onClose={handleFilterMenuClose}
                  >
                  
                    <MenuItem disabled value="">
                    <em>{title}</em>
                    </MenuItem>
                      {pattern[key] && pattern[key][0].sort(function(a,b){return a && b && parseInt(a.split('-')[1]) - parseInt(b.split('-')[1])}).map(function(entity,index){
                        return <MenuItem value={entity}  onClick={(e) => handleSelectChange(e)}> {entity} </MenuItem>
                      })}
                    </Menu>
                <div>
                  { pattern[key][1] && pattern[key][1].map(pattern => {
                  return  (<Chip
                  
                    className={`${classes.patternChips} ${key}`}
                    style={{backgroundColor: GET_ENTITY_COLOR(key)}}
                    label={pattern}
                    color="primary"
                    onDelete={handleDelete}
                    // deleteIcon={<DoneIcon className={key}/>} 
                    />)
                  })}
                </div>
              </div>
              </ExpansionPanelDetails>
              </ExpansionPanel>)
            }
            else{
            return (
              <ExpansionPanel key={index} expanded={expanded.indexOf(index) !== -1} onChange={handlePanelChange(index)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                  <Typography variant='h6'>{title}</Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails key={index} style={{ display: 'block' }}>
                <ReactQuill 
                  theme={'snow'}
                  onChange={updateRichFields(index)}
                  value={editorStateArray[index]}
                  modules={CreateOrEditPatternDialog.modules}
                  formats={CreateOrEditPatternDialog.formats}
                />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            );
          }}
        }) : 
        Object.keys(data).filter(key => !dataFilter.includes(key)).map((key, index) => {
          if (true) {
            if(key ==="name")
              requiredElementsIndex.push(index)
            else if(key === "identifier")
              requiredElementsIndex.push(index)
            const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
             if(key.includes('Patterns') || key.includes('concern')){
              return (
                <ExpansionPanel key={index} expanded={expanded.indexOf(index) !== -1} onChange={handlePanelChange(index)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                <Typography variant='h6'>{title}</Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails key={index} style={{ display: 'block' }}>
                <div>
                  <IconButton
                    className= {key}
                    aria-label='show filter menu'
                    aria-controls={'filter-menu'}
                    aria-haspopup='true'
                    onClick={handleFilterMenuOpen}
                    color='inherit'
                  >
                    <FilterIcon fontSize='large' color='secondary' />
                  </IconButton>
                  <Menu
                  className={key}
                    anchorEl={pattern[key][4]}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={pattern[key][5]}
                    onClose={handleFilterMenuClose}
                  >
                  
                    <MenuItem disabled value="">
                    <em>{title}</em>
                    </MenuItem>
                      {pattern[key] && pattern[key][0].sort(function(a,b){return a && b && parseInt(a.split('-')[1]) - parseInt(b.split('-')[1])}).map(function(entity,index){
                        return <MenuItem value={entity}  onClick={(e) => handleSelectChange(e)}> {entity} </MenuItem>
                      })}
                    </Menu>
                  <div>
                    { pattern[key] && pattern[key][1].map(pattern => {
                    return  (<Chip
                    
                      className={`${classes.patternChips} ${key}`}
                      style={{backgroundColor: GET_ENTITY_COLOR(key)}}
                      label={pattern}
                      color="primary"
                      onDelete={handleDelete}
                      // deleteIcon={<DoneIcon className={key}/>} 
                      />)
                    })}
                  </div>
                </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>)
            }
            else{
            return (
              <ExpansionPanel key={index} expanded={expanded.indexOf(index) !== -1} onChange={handlePanelChange(index)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                  <Typography variant='h6'>{title}</Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails key={index} style={{ display: 'block' }}>
                <ReactQuill 
                  theme={'snow'}
                  onChange={updateRichFields(index)}
                  value={editorStateArray[index]}
                  modules={CreateOrEditPatternDialog.modules}
                  formats={CreateOrEditPatternDialog.formats}
                />
                </ExpansionPanelDetails>
              </ExpansionPanel>
              
            )};
          }
        })
        }
        </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>handleClose(false)} color="secondary">
            Cancel
          </Button>
          {createOrEdit === "Edit" ?
          <Button disabled={( editorStateArray[requiredElementsIndex[0]] !== undefined && editorStateArray[requiredElementsIndex[0]].toString().replace(/<\/?[^>]+(>|$)/g, "") == "") || ( editorStateArray[requiredElementsIndex[1]] !== undefined && editorStateArray[requiredElementsIndex[1]].toString().replace(/<\/?[^>]+(>|$)/g, "") == "")} onClick={e=>handleSubmit(e,data,handleClose)} color="primary" variant='contained'>
            Save
          </Button>:
          <Button disabled={(!editorStateArray[requiredElementsIndex[0]] && editorStateArray[requiredElementsIndex[0]] !== undefined && editorStateArray[requiredElementsIndex[0]].replace(/<\/?[^>]+(>|$)/g, "") == "") || (!editorStateArray[requiredElementsIndex[1]] && editorStateArray[requiredElementsIndex[1]] !== undefined && editorStateArray[requiredElementsIndex[1]].replace(/<\/?[^>]+(>|$)/g, "") == "")} onClick={e=>handleSubmit(e,data,handleClose)} color="primary" variant='contained'>
            Create
          </Button>
          }
        </DialogActions>
		</Dialog>
	)
}

CreateOrEditPatternDialog.modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
    ImageResize: {handleStyles: {
      backgroundColor: 'black',
      border: 'none',
      color: 'white',
    },
    modules: ['Resize', 'DisplaySize', 'Toolbar'],}
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  CreateOrEditPatternDialog.formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ]

export default CreateOrEditPatternDialog;