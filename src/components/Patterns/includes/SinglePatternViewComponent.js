import React from 'react'
import { Helmet } from 'react-helmet';
import Paper from '@material-ui/core/Paper'
import {Button, Dialog, DialogActions,DialogContent, DialogTitle, Divider, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, IconButton,Menu,Chip,Select, InputLabel, MenuItem, Typography} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Fab from '@material-ui/core/Fab'
import makeStyles from '@material-ui/core/styles/makeStyles'
import EditIcon from '@material-ui/icons/Edit'
import CustomSnackBar from '../../CustomSnackBar';
import { GET_ENTITY_COLOR } from '../../../config'
import PatternVisualization from './PatternVisualization';
import CreateOrEditPatternDialog from './CreateOrEditPatternDialog';
import CommentsView from './Comments/CommentsView';
import ReactHtmlParser from "react-html-parser";
import Icon from '@material-ui/core/Icon'
import {REGEX_PATTERNS_URL_LOCAL, REGEX_ID_SEARCH} from '../../../constants';
import ItemsService from '../../../services/ItemsService';
import '../../../styles/MuiChip.css';
import Quill from 'quill'
import RemoveIcon from '@material-ui/icons/RemoveRounded'
import { IndentStyle } from './indent.js'



const useStyles = makeStyles(theme => {
	const chip = {
		margin: theme.spacing(1, 1, 0, 0),
		padding: theme.spacing(1, 1, 1, 0),
		maxWidth: '90%',
	}
	return {
		root: {
			marginTop: theme.spacing(5),
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			backgroundColor: theme.palette.common.white
		},
		paper: {
			padding: theme.spacing(2, 5, 0, 5),
			[theme.breakpoints.up('md')]: {
				margin: theme.spacing(0, 10, 10, 10),
			},
		},
		paperComments: {
			padding: theme.spacing(2, 9, 2, 9),
			[theme.breakpoints.up('md')]: {
				margin: theme.spacing(0, 10, 10, 10),
			},
		},
		title: {
			marginBottom: theme.spacing(1)
		},
		chip: {
			...chip
		},
		chipLabel: {
			overflow: 'hidden',
			textOverflow: 'ellipsis',
			width: '100%'
		},
		chipRelations: {
			...chip,
			color: theme.palette.common.white,
		},
		button: {
			marginRight: theme.spacing(1),
		},
		fab: {
			position: 'fixed',
			bottom: theme.spacing(4),
			right: theme.spacing(5)
		},
		patternHeader: {
			verticalAlign: 'middle'
		},
		circle: {
			color: theme.palette.primary.contrastText,
			margin: theme.spacing(1),
			borderRadius: '50%',
			height: '50px',
			width: '50px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		},
		paperBackground: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.default,
			paddingTop: theme.spacing(7),
			marginBottom: '-100px'
		},
		imageIcon: {
			height: '100%',
			filter: "invert(1)"
	},

		clapbutton:{
				
				position: 'fixed',
				bottom: theme.spacing(5),
				left: theme.spacing(2),
				color: '#fff',
				opacity: '0.8',
				backgroundColor: 'rgb(240, 240, 240)',
				"&:hover, &:focus": {
					backgroundColor: '#fff',
					color: 'rgb(25, 91, 139)',
					transform: 'scale(1)',
					filter: 'drop-shadow(0 3px 12px rgba(0, 0, 0, 0.05))',
					transition: 'all .1s ease-in',
					zIndex: '1',
					pointerEvents: 'visible',
					animation: 'clap 1s ease-in-out forwards',
					transition: 'border-color 0.3s ease-in',
					boxShadow: '0 0 5px 5px'
				},
  			  "&:after" :{
      			animation: 'shockwave 1s ease-in infinite'
    				} 
				},



		iconRoot: {
			textAlign: 'center',
			marginRight: theme.spacing(1)
	}

	}
	
}



)


const SinglePatternViewComponent = props => {
	const { history, data, comments, entity, positionData, actualData, linkData, hovered, selectedItem, height, width, nodeRadius, handleNodeEnter, handleNodeLeave, handleNodeClick } = props
	const [isEditPatternDialogOpen, setIsEditPatternDialogOpen] = React.useState(false)
	
	Quill.register(IndentStyle, true)

	const [showToast, setShowToast] = React.useState(false);
	const classes = useStyles()
	const [clapData, setClapData] = React.useState([]);
	const [clapCount, setClapCount] = React.useState(0);

	var updateddata = [];

	const [expanded, setExpanded] = React.useState(Object.keys(data).map((value, index) => index === 0? index : -1))

	const isDataEmpty = () => Object.keys(data).filter(key => !['id', 'name', 'identifier'].includes(key)).filter(key => !(Array.isArray(data[key]) && data[key].length === 0)).length !== 0

	const handleChipClick = (identifier, entity) => {
		history.push(`/patterns/${entity}/${identifier}`)
		window.location.reload();
	}

	var parts = [];

	const selectedEntity = entity;

	if(selectedEntity === "Anti Patterns")
	{
		 parts = [
			{
				title: 'Anti Pattern Overview',
				sections: [
					{
						attributes: [
							{
								heading: 'Alias',
								content: data.alias || '-'
							},
							{
								heading: 'Summary',
								content: data.summary || '-'
							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Example": data.example,
					"Context": data.context,
					"Problem": data.problem,
					"Forces": data.forces,
					"General Form":	data.generalForm,
					"Variants": data.variants,
					"Consequences": data.consequences,
					"Revised Solution": data.revisedSolution
				};
		
	}

	if(selectedEntity === "Principles")
	{

		 parts = [
			{
				title: 'Principle Overview',
				sections: [
					{
						attributes: [
							{
								heading: 'Alias',
								content: data.alias  || '-'
							},
							{
								heading: 'Type',
								content: data.type || '-'
							},
							{
								heading: 'Binding Nature',
								content: data.bindingNature.length > 0 ? data.bindingNature :undefined || '-'
							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Context": data.context,
					"Problem": data.problem,
					"Forces": data.forces,
					"Variants": data.variants,
					"Consequences": data.consequences,
					"See Also": data.seeAlso,
					"Other Standards": data.otherStandards,
					"Known Uses": data.knownUses
				};
				
	}

	if(selectedEntity === "Visualization Patterns")
	{

		 parts = [
			{
				title: 'V-Pattern Overview',
				sections: [
					{
						attributes: [
							{
								heading: 'Alias',
								content: data.alias || '-'
							},
							{
								heading: 'Summary',
								content: data.summary || '-'
							},
							{
								heading: 'Type',
								content: data.type || '-'
							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Example": data.example,
					"Context": data.context,
					"Problem": data.problem,
					"Forces": data.forces,
					"Solution": data.solution,
					"Variants": data.variants,
					"Consequences": data.consequences,
					"See Also": data.seeAlso,
					"Other Standards": data.otherStandards,
					"Known Uses": data.knownUses
				};

	}

	if(selectedEntity === "Coordination Patterns")
	{
		 parts = [
			{
				title: 'CO-Pattern Overview',
				sections: [
					{
						
						attributes: [
							{
								heading: 'Alias',
								content: data.alias || '-'
							},
							{
								heading: 'Summary',
								content: data.summary || '-'
							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Example": data.example,
					"Context": data.context,
					"Problem": data.problem,
					"Forces": data.forces,
					"Solution": data.solution,
					"Variants": data.variants,
					"Consequences": data.consequences,
					"Known Uses": data.knownUses
				};


	}

	

	if(selectedEntity === "Methodology Patterns")
	{
		 parts = [
			{
				title: 'M-Pattern Overview',
				sections: [
					{
						
						attributes: [
							{
								heading: 'Alias',
								content: data.alias || '-'
							},
							{
								heading: 'Summary',
								content: data.summary || '-'
							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Example": data.example,
					"Context": data.context,
					"Problem": data.problem,
					"Forces": data.forces,
					"Solution": data.solution,
					"Variants": data.variants,
					"Consequences": data.consequences,
					"See Also": data.seeAlso,
					"Known Uses": data.knownUses
				};
	}

	if(selectedEntity === "Concerns")
	{
		 parts = [
			{
				title: 'Concern Overview',
				sections: [
					{
						
						attributes: [
							{
								heading: 'Category',
								content: data.category || '-'
							},
							{
								heading: 'Scale Level', 
								content: data.scalingLevel || '-'
								
								

							}
						]
					}
						]
					}
				]

				updateddata = {
					"":'',
					"Principles": data.principles,
					"Visualization Pattern": data.visualizationPatterns,
					"CoordinationPatterns": data.coordinationPatterns,
					"Methodology Pattern": data.methodologyPatterns
				};
	}

	if(selectedEntity === "Stakeholders")
	{
		parts = [
			{
				title: 'Concern Overview',
				sections: [
					{
						
						attributes: [
							{
								heading: 'Category',
								content: data.category || '-'
							},
							{
								heading: 'Scale Level',
								content: data.scalingLevel || '-'
							}
						]
					}
						]
					}
				]
				updateddata = {
					"":'',
					"Concerns": data.concerns
				};
	}
	

	const [expandedOverview, setExpandedOverview] = React.useState(parts.map((part, index) => index))

	const handleEditPatternDialogOpen = () => {
		setIsEditPatternDialogOpen(true)
	}
	const handleEditPatternDialogClose = (success) => {
		setIsEditPatternDialogOpen(false)
        if(success)
		 setShowToast(true);
	}

	const handlePanelChange = index => () => {
    setExpanded(expanded.indexOf(index) !== -1 ? expanded.filter(item => item !== index) : [...expanded, index])
    

	}

	const handleOverviewPanelChange = index => () => {
		setExpandedOverview(expandedOverview.indexOf(index) !== -1 ? expandedOverview.filter(item => item !== index) : [...expandedOverview, index])
	}


	const sendClapCount = () => {
	let present = false;
	let id="";
	for(var i=0;i<clapData.length;i++) {
		if(clapData[i].name == data.identifier) {
			present = true;
			id = clapData[i].id;
			break;
		}
	}	

	if(present) {
		ItemsService.updateClapCount(id, data.identifier, data.name, clapCount);
	} else {
		ItemsService.createClapCount(data.identifier, data.name);
	}

	setClapCount(clapCount+1);

};

	const calculateClapCount  = () => {
		if(clapData.length == 0){
			setClapCount(0);
		} else {
			for(var i=0;i<clapData.length;i++) {
				if(clapData[i].name == data.identifier) {
					setClapCount(parseInt(clapData[i].claps));
					break;
				}
			}	
		}
	}

	

	React.useEffect(() => {
		
    setTimeout(() => {
			if(localStorage.getItem("authentication")) {
			const authentication = JSON.parse(localStorage.getItem("authentication"));
			}

		const clapCountFromBackend = ItemsService.getClapCount();
		clapCountFromBackend.promise.then(data => {
			setClapData(data.value);
		  data.value.forEach((record) => clapData.push(record));
			calculateClapCount();
				console.log(data);
		});

		
		}, 100);
  }, []);

	const renderChipsUsingRegex = data => {
		var urlRegExp = new RegExp(REGEX_PATTERNS_URL_LOCAL, 'g');
		var patternIdRegExp = new RegExp(REGEX_ID_SEARCH);
		var htmlString = data;
		var dataArray = urlRegExp.exec(htmlString);
		// Check for multiple matches
		if(dataArray && dataArray.length > 0) {
		  var matchesArray = dataArray[0].split("</a> ");
		  if(matchesArray.length > 1) {
				// Multiple matches
			for(var a = 0; a < matchesArray.length; a++) {
			  if( a === matchesArray.length - 1) {
					// Last element, don't append end tag
				var patternInfo = patternIdRegExp.exec(matchesArray[a]);
				var patternId = patternInfo[0].split("/");
				var stringToReplace = `${matchesArray[a]}`;
				var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]}/${patternId[1]}" style={{ text-decoration: "none" }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1].replace('%20', ' ').slice(0, -1)} ${patternId[1]}</span></div></a>`;
				htmlString = htmlString.replace(stringToReplace, replacement);
			  }
			  else {
					// Only one match
				matchesArray[a] = matchesArray[a]+'</a>';
				var patternInfo = patternIdRegExp.exec(matchesArray[a]);
				var patternId = patternInfo[0].split("/");
				var stringToReplace = `${matchesArray[a]}`;
				var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]}/${patternId[1]}" style={{ text-decoration: "none" }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1].replace('%20', ' ').slice(0, -1)} ${patternId[1]}</span></div></a>`;
				htmlString = htmlString.replace(stringToReplace, replacement);
			  }
			}
		  }
		  else {
			var patternInfo = patternIdRegExp.exec(dataArray[0]);
			var patternId = patternInfo[0].split("/");
			var stringToReplace = `${dataArray[0]}`;
			var replacement = `<a href="http://localhost:8000/#/patterns/${patternInfo[1]}/${patternId[1]}" style={{ text-decoration: "none }}><div role="button" class="MuiChip-root MuiChip-colorPrimary MuiChip-clickableColorPrimary MuiChip-clickable" tabindex="0"><span class="MuiChip-label">${patternInfo[1].replace('%20', ' ').slice(0, -1)} ${patternId[1]}</span></div></a>`;
			htmlString = htmlString.replace(stringToReplace, replacement);
		  }
		}
		return htmlString;
	  }

	return (
		<div className={classes.root}>
			<Helmet>
			<title>{`${entity} \u2013 ${data.name}`}</title> 
			</Helmet>
			<PatternVisualization displayDynamic={false} positionData={positionData} linkData={linkData} height={height} width={width} nodeRadius={nodeRadius} hovered={hovered} handleNodeEnter={handleNodeEnter} handleNodeLeave={handleNodeLeave} searched={[]} onPath={[]} selectedItem={selectedItem} handleNodeClick={handleNodeClick} />
			<Paper square elevation={24} className={classes.paperBackground}>	
				<Paper elevation={6} className={classes.paper} style={{paddingBottom: '30px'}}>
					<div style={{ display: 'flex'}}>
						<Typography className={classes.patternHeader} variant='h5'>{entity.slice(0, entity.length - 1)}</Typography>
						<div style={{ flexGrow: 1 }}></div>
						<div className={classes.circle} style={{ backgroundColor: GET_ENTITY_COLOR(entity) }}><Typography>{data.identifier}</Typography></div>
					</div>
					<div style={{ display: 'flex' }}>
						<Typography className={classes.title} variant='h4'>{data.name}</Typography>
						<div style={{ flexGrow: 1 }}></div>
					</div>
					{isDataEmpty() && <Divider />}
					<div style={{ display: 'block', marginTop :'20px' }}>
					{parts.map((part, index) => (
					<ExpansionPanel key={index} expanded={expandedOverview.indexOf(index) !== -1} onChange={handleOverviewPanelChange(index)}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
							<Typography variant='h6'>{part.title}</Typography>
						</ExpansionPanelSummary>
						<Divider />

					{part.sections.map((section, index) => (
							<ExpansionPanelDetails key={index} style={{ display: 'block' }}>
								<Typography variant='h5'>{section.sectionName}</Typography>
								<table style={{ borderSpacing: '0px 20px' }}>
									<tbody >
										{section.attributes.map((attribute, index) => (
											<tr key={index} style={{ border: 'none' }}>
												<td style={{ width: '250px', paddingRight: '10px' }}>
													<Typography>{attribute.heading}</Typography>
												</td>
												<td>
													{Array.isArray(attribute.content) ?
														attribute.content.map((item, index) => (
															<Typography>{ReactHtmlParser(renderChipsUsingRegex(item.replace("[\"","").replace("\"]","").replace('[]','-')))}</Typography>
														))
														:
														<Typography>{ReactHtmlParser(renderChipsUsingRegex(attribute.content && attribute.content.replace("[\"","").replace("\"]","").replace('[]','-')))}</Typography>
													}
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{index < part.sections.length - 1 && <Divider light />}
							</ExpansionPanelDetails>
						))}
								</ExpansionPanel>
				))}	
					</div>
					<div style={{ display: 'block', marginTop :'20px', marginBottom :'30px' }}>
								{Object.keys(updateddata).filter(key => !['id', 'name', 'identifier'].includes(key)).map((key, index) => {
									if (!(Array.isArray(updateddata[key]) && updateddata[key].length === 0) && updateddata[key] !== null) {
										const title = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
										if(selectedEntity === 'Anti Patterns'){ 
										if(key === 'summary' || key === 'alias' || key === '')
										{
											return(null)
										}
										}

										if(selectedEntity === 'Coordination Patterns'){ 
											if(key === 'summary' || key === 'alias' || key === '')
											{
												return(null)
											}
											}

										if(selectedEntity === "Visualization Patterns"){ 
											if(key === 'summary' || key === 'alias' || key === 'type' || key === '')
											{
												return(null)
											}
											}

											

										if(selectedEntity === "Principles"){ 
											if(key === 'summary' || key === 'alias' || key === 'type' || key === 'bindingnature' || key === '')
											{
												return(null)
											}
											}

											if(selectedEntity === "Methodology Patterns"){ 
												if(key === 'summary' || key === 'alias' || key === '')
												{
													return(null)
												}
												}

												if(selectedEntity === "Concerns"){ 
													if(key === 'category' || key === 'scalingLevel' || key === '')
													{
														return(null)
													}
													}
	
												if(selectedEntity === "Stakeholders"){ 
													if(key === 'category' || key === 'scalingLevel' || key === '')
													{
														return(null)
													}
													}

										return (
											<ExpansionPanel defaultExpanded={true} key={index} expanded={expanded.indexOf(index) === -1} onChange={handlePanelChange(index)}>
												<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
													<Typography variant='h6'>{title}</Typography>
												</ExpansionPanelSummary>
												<Divider />
												<ExpansionPanelDetails key={index} style={{ display: 'block' }}>
												{Array.isArray(updateddata[key]) ?
														typeof (updateddata[key][0]) === 'object' ?
														updateddata[key].map((item, index) => (<Chip key={index} classes={{ label: classes.chipLabel }} style={{ backgroundColor: GET_ENTITY_COLOR(key) }} className={classes.chipRelations} label={`${item.identifier} - ${item.name}`} onClick={() => handleChipClick(item.identifier, title)} />))
															:
															updateddata[key].length>0 ? updateddata[key].map((item, index) => (<Typography>{ReactHtmlParser(renderChipsUsingRegex(item.replace("[\"","").replace("\"]","").replace('[]','-')))}</Typography>)) : '-'
														:
												<Typography> {ReactHtmlParser(renderChipsUsingRegex(updateddata[key] && updateddata[key].replace("[\"","").replace("\"]","").replace('[]','-'))) }</Typography>
									}
               				 </ExpansionPanelDetails>
												</ExpansionPanel>
												)};
												}
												)
											}	
					</div>	
			</Paper>
				<Paper elevation={6} className={classes.paperComments}>
					<CommentsView comments={comments} pattern={data.identifier} patternName={data.name}/>
				</Paper>
			</Paper>

			{ItemsService.isLoggedIn() ? 
				<Fab 
				style= {{width: '70px',
				height: '50px',
				borderRadius: '40%',
				marginLeft: '-10px',
				outline: '0',
				cursor: 'pointer'
					}}
				variant="extended"
				size="small"
				color="primary"
				aria-label="add"
				className={classes.clapbutton}
				onClick={() => sendClapCount()}
				>
					<svg width="29" height="29">
						<g fill-rule="evenodd">
							<path d="M13.74 1l.76 2.97.76-2.97zM16.82 4.78l1.84-2.56-1.43-.47zM10.38 2.22l1.84 2.56-.41-3.03zM22.38 22.62a5.11 5.11 0 0 1-3.16 1.61l.49-.45c2.88-2.89 3.45-5.98 1.69-9.21l-1.1-1.94-.96-2.02c-.31-.67-.23-1.18.25-1.55a.84.84 0 0 1 .66-.16c.34.05.66.28.88.6l2.85 5.02c1.18 1.97 1.38 5.12-1.6 8.1M9.1 22.1l-5.02-5.02a1 1 0 0 1 .7-1.7 1 1 0 0 1 .72.3l2.6 2.6a.44.44 0 0 0 .63-.62L6.1 15.04l-1.75-1.75a1 1 0 1 1 1.41-1.41l4.15 4.15a.44.44 0 0 0 .63 0 .44.44 0 0 0 0-.62L6.4 11.26l-1.18-1.18a1 1 0 0 1 0-1.4 1.02 1.02 0 0 1 1.41 0l1.18 1.16L11.96 14a.44.44 0 0 0 .62 0 .44.44 0 0 0 0-.63L8.43 9.22a.99.99 0 0 1-.3-.7.99.99 0 0 1 .3-.7 1 1 0 0 1 1.41 0l7 6.98a.44.44 0 0 0 .7-.5l-1.35-2.85c-.31-.68-.23-1.19.25-1.56a.85.85 0 0 1 .66-.16c.34.06.66.28.88.6L20.63 15c1.57 2.88 1.07 5.54-1.55 8.16a5.62 5.62 0 0 1-5.06 1.65 9.35 9.35 0 0 1-4.93-2.72zM13 6.98l2.56 2.56c-.5.6-.56 1.41-.15 2.28l.26.56-4.25-4.25a.98.98 0 0 1-.12-.45 1 1 0 0 1 .29-.7 1.02 1.02 0 0 1 1.41 0zm8.89 2.06c-.38-.56-.9-.92-1.49-1.01a1.74 1.74 0 0 0-1.34.33c-.38.29-.61.65-.71 1.06a2.1 2.1 0 0 0-1.1-.56 1.78 1.78 0 0 0-.99.13l-2.64-2.64a1.88 1.88 0 0 0-2.65 0 1.86 1.86 0 0 0-.48.85 1.89 1.89 0 0 0-2.67-.01 1.87 1.87 0 0 0-.5.9c-.76-.75-2-.75-2.7-.04a1.88 1.88 0 0 0 0 2.66c-.3.12-.61.29-.87.55a1.88 1.88 0 0 0 0 2.66l.62.62a1.88 1.88 0 0 0-.9 3.16l5.01 5.02c1.6 1.6 3.52 2.64 5.4 2.96a7.16 7.16 0 0 0 1.18.1c1.03 0 2-.25 2.9-.7A5.9 5.9 0 0 0 23 23.24c3.34-3.34 3.08-6.93 1.74-9.17l-2.87-5.04z">
							</path>
						</g>
					</svg>
					<Typography style= {{color:'black', paddingLeft:'3px'}}>{clapCount}</Typography>
			</Fab>
			:
			null
			}
			{
				ItemsService.isLoggedIn() && ItemsService.isAdminAndVerified() ?
				<Fab variant="extended" color='primary' aria-label="edit" className={classes.fab} onClick={handleEditPatternDialogOpen} style={{ backgroundColor: GET_ENTITY_COLOR(entity) }}>
					<EditIcon className={classes.button} />
					Edit
				</Fab>
				:
				null
			}

			<CreateOrEditPatternDialog open={isEditPatternDialogOpen} handleClose={handleEditPatternDialogClose} type={entity} actualData= {actualData.flat()} data={data} createOrEdit={'Edit'}/>
			{
          showToast ? React.createElement(
            CustomSnackBar,
            {message:"Updated Successfully!"},
            
          ): null
          }
		</div>
	)
}

export default SinglePatternViewComponent


