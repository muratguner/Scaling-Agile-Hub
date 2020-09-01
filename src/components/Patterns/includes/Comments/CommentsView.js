import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import SingleComment from './SingleComment';
import CreateComment from './CreateComment';
import ItemsService from '../../../../services/ItemsService';

const useStyles = makeStyles(theme => {
	return {
		root: {
			margin: theme.spacing(1),
			display: 'flex',
			flexDirection: 'column',
			backgroundColor: theme.palette.common.white,
			
        },
        comments: {
            display: 'flex',
			flexDirection: 'column',
			alignSelf: "center",
			marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
			backgroundColor: theme.palette.common.white,
			width: "70%",
			maxWidth: "70%"
        }
	}
})


const CommentsView = props => {
	const {comments, pattern, patternName} = props;
	const classes = useStyles();

	var commentsForSelectedPattern = comments.filter(function(row) { return row.pattern === pattern; }).sort(function(a, b){return b.timestamp-a.timestamp});;
	var numberOfComments = commentsForSelectedPattern.length;
	return (
		<div className={classes.root}>
            <Typography variant='h4'>{numberOfComments} Comment(s)</Typography>
            <div className={classes.comments}>
				{
					ItemsService.isLoggedIn() ?
					<CreateComment pattern={pattern} patternName={patternName} isSubCommentOf={null}/>
					:
					null
				}
				{commentsForSelectedPattern.map((comment, index) => {
					return <SingleComment comment={comment} comments={comments}/>;
				})}
            </div>
		</div>
	);
}

export default CommentsView;


