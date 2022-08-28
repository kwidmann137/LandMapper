import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '../Common/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    modalContent: {
        textAlign: 'center'
    },
    modal: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    buttonContainer: {
        textAlign: 'center'
    }
});

class SetBoundariesModal extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        const { classes, open, message, onClick } = this.props;

        return (
            <Modal open={open} classes={{ root: classes.modal }}>
                <div className={classes.modalContent}>
                    {message}
                </div>
                <div className={classes.buttonContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button}`}
                        onClick={onClick}
                    >
                        Ok
                    </Button>
                </div>
            </Modal>
        );
    }
}

export default withStyles(styles)(SetBoundariesModal)