import React from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'
import Button from '@material-ui/core/Button'
import Footer from '../components/Footer'
import ItemsService from '../services/ItemsService'
import Header from '../components/Header';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fafafa',
        textAlign: 'center'
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        margin: '100px'
    },
    text: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}))

const TestView = props => {
    const { history } = props

    const classes = useStyles()

    const handlePost = event => {
		ItemsService.createPattern('vyx8g9qgbmuv',"Real - Lessons Learned in Aligning Data and Model Evolution in Collaborative Information Systems",[
            {
                "name":"Abstract",
                "values": ["Today's enterprises have to align their information systems continuously with their dynamic business and IT environment. ..."]
            },
            {
                "name":"Status",
                "values":["Accepted"]
            }]).then(data => {
		})
    }
    const handlePut = event => {
		ItemsService.editPattern('al36wk1o79t2',"Reals - Lessons Learned in Aligning Data and Model Evolution in Collaborative Information Systems",[
            {
                "name":"Abstract",
                "values": ["Today's enterprises have to align their information systems continuously with their dynamic business and IT environment. ..."]
            },
            {
                "name":"Status",
                "values":["Accepted"]
            }]).then(data => {
		})
    }

    return (
        <div className={classes.root}>
            <Header history={history} />
            <div className={classes.main}>
                <Button color="primary" className={classes.button} onClick={handlePost}>
                    Test Post API
                </Button>
                <Button color="primary" className={classes.button} onClick={handlePut}>
                    Test Put API
                </Button>
            </div>
            <Footer />
        </div>
    )
}

export default TestView