import React from 'react'
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {},
    container: {
        position: 'absolute',
        minHeight: 100,
        width: '90%',
        backgroundColor: "#FFF",
        borderRadius: 5,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 2
    }
});

const Modal = ({classes, open, children}) => {

    return (
        <div className={`${(classes.root || '')} ${classes.container}`} style={{ visibility: open ? 'visible' : 'hidden'}}>
            {children}
        </div>
    );
};

export default withStyles(styles)(Modal);