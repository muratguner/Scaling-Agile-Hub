import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {Avatar, Button, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Fab, IconButton, Icon, Typography} from '@material-ui/core';
import {Doughnut, Pie} from 'react-chartjs-2';
import Carousel from 'react-material-ui-carousel'
const useStyles = makeStyles(theme => {
	return {
		feedRoot: {
            width: '100%',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
			display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            backgroundColor: theme.palette.common.white,
            '& .MuiPaper-root':{
                boxShadow: 'none'
            }
        },
        card: {
            width: '100%',
            margin: theme.spacing(2),
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',

            '& .chartjs-render-monitor':{
                width:'500px !important',
                height:'500px !important'
            },
        },
        carousel: {
            padding: theme.spacing(10)
        }
	}
})


const MainFeed = props => {
    const {allData, allComments, allRatings} = props;
    const classes = useStyles();

    var numberOfStakeholders = 0;
    var numberOfConcerns = 0;
    var numberOfAntiPatterns = 0;
    var numberOfPrinciples = 0;
    var numberOfMPatterns = 0;
    var numberOfCPatterns = 0;
    var numberOfVPatterns = 0;

    allData && allData !== undefined && allData.map(val1 => {
        val1.map(val2 => {
            switch(val2.description) {
                case 'Stakeholders':
                    numberOfStakeholders = val2.data.length;
                    break;
                case 'Concerns':
                    numberOfConcerns = val2.data.length;
                    break;
                case 'Anti Patterns':
                    numberOfAntiPatterns = val2.data.length;
                    break;
                case 'Principles':
                    numberOfPrinciples = val2.data.length;
                    break;
                case 'Methodology Patterns':
                    numberOfMPatterns = val2.data.length;
                    break;
                case 'Coordination Patterns':
                    numberOfCPatterns = val2.data.length;
                    break;
                case 'Visualization Patterns':
                    numberOfVPatterns = val2.data.length;
                    break;
                default:
                    break;

            }
        });
    });
    const dataPie = {
        labels: [
            'Stakeholders',
            'Concerns',
            'Anti Patterns',
            'Principles',
            'Methodology Patterns',
            'Coordination Patterns',
            'Visualization Patterns'
        ],
        datasets: [{
            data: [numberOfStakeholders, 
                numberOfConcerns, 
                numberOfAntiPatterns, 
                numberOfPrinciples, 
                numberOfMPatterns, 
                numberOfCPatterns, 
                numberOfVPatterns],
            backgroundColor: [
            '#bdc3c7',
            '#F29B30',
            '#e74c3c',
            '#34495e',
            '#3498db',
            '#9b59b6',
            '#4EBA6F'
            ],
            hoverBackgroundColor: [
            '#bdc3c7',
            '#F29B30',
            '#e74c3c',
            '#34495e',
            '#3498db',
            '#9b59b6',
            '#4EBA6F'
            ]
        }]
    };

    var commentsMap = new Map();
    var commentNamesMap = new Map();
    allComments && allComments !== undefined && allComments.map(value => {
        if(commentsMap.has(value.pattern)) {
            commentsMap.set(value.pattern, commentsMap.get(value.pattern) + 1);
            commentNamesMap.set(value.pattern, value.patternName);
        }
        else {
            commentsMap.set(value.pattern, 1);
            commentNamesMap.set(value.pattern, value.patternName);
        }
    });

    var sortedCommentsMap = new Map([...commentsMap.entries()].sort((a, b) => b[1] - a[1]));


    const commentsData = {
        labels: Array.from({length: 3}, (i => () => i.next().value)(commentNamesMap.values())),
        datasets: [{
            data: Array.from({length: 3}, (i => () => i.next().value)(sortedCommentsMap.values())),
            backgroundColor: [
            '#9b59b6',
            '#F29B30',
            '#e74c3c'
            ],
            hoverBackgroundColor: [
            '#9b59b6',
            '#F29B30',
            '#e74c3c'
            ]
        }]
    };

    allRatings.sort((a,b) => b.claps - a.claps);
    var top3Ratings = allRatings.slice(0, 3);

    const ratingsData = {
        labels: top3Ratings.map(val => val.patternName),
        datasets: [{
            data: top3Ratings.map(val => val.claps),
            backgroundColor: [
            '#34495e',
            '#3498db',
            '#e74c3c'
            ],
            hoverBackgroundColor: [
            '#34495e',
            '#3498db',
            '#e74c3c'
            ]
        }]
    };

    return (
		<div className={classes.feedRoot}>
         <Carousel indicators autoPlay={false} animation="slide" className={classes.carousel}>
            <Card variant="outlined" className={classes.card}>
                <CardHeader
                    title={<Typography component={'div'} variant='h4'>Pattern Coverage</Typography>}
                />
                <CardContent>
                    <Pie data={dataPie}
                        width={500}
                        height={500}
                        options={{ maintainAspectRatio: false }} />
                </CardContent>
            </Card>
            <Card variant="outlined" className={classes.card}>
                <CardContent>
                        <Pie data={commentsData}
                            width={500}
                            height={500}
                            options={{ maintainAspectRatio: false }} />
                </CardContent>
                <CardHeader
                    title={<Typography component={'div'} variant='h4'>Most Commented</Typography>}
                />
            </Card>
            <Card variant="outlined" className={classes.card}>
            <CardHeader
                    title={<Typography component={'div'} variant='h4'>Highest Rated</Typography>}
                />
                <CardContent>
                    <Pie data={ratingsData}
                        width={500}
                        height={500}
                        options={{ maintainAspectRatio: false }} />
                </CardContent>
            </Card>
            </Carousel> 
		</div>
	);
}

export default MainFeed;


