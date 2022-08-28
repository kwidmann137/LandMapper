import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '../Common/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
    },
    savedItems: {
        listStyle: 'none',
        margin: theme.spacing.unit,
        padding: 0,
        '&:nth-child(odd)': {
            backgroundColor: 'lightgrey'
        }
    },
    textField: {
        width: '80%'
    },
    selectedItem: {
        backgroundColor: 'grey'
    }
});

class SaveModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            saveName: "",
            savedItems: [],
            selectedIndex: null
    }
    }

    componentDidMount = () => {

        let savedItems = JSON.parse(localStorage.getItem('FindYourMark'));

        console.log(savedItems);

        if (savedItems == null) {
            savedItems = [];
        }

        this.setState({ savedItems });
    }

    handleSave = () => {

        const { saveName } = this.state;
        const savedItems = [...this.state.savedItems];

        savedItems.push({
            name: saveName,
            markers: this.props.markers
        });

        this.setState({ savedItems });
        localStorage.setItem('FindYourMark', JSON.stringify(savedItems));

        console.log(JSON.stringify(savedItems));

        this.props.onComplete();
    }

    handleLoad = () => {
        const { selectedIndex, savedItems } = this.state;

        console.log(savedItems[selectedIndex].markers);

        this.props.onComplete(savedItems[selectedIndex].markers);
    }

    render() {

        const { saveName, savedItems, selectedIndex } = this.state;
        const { classes, open, onComplete } = this.props;

        return (
            <Modal open={open} classes={{ root: classes.modal }}>
                <div className={classes.modalContent}>
                    <ul className={classes.savedItems}>
                        {
                            savedItems.map((item, index) => {
                                return (
                                    <li
                                        key={index}
                                        onClick={() => this.setState({ selectedIndex: index })}
                                        className={`${classes.item} ${selectedIndex === index ? classes.selectedItem : ""}`}
                                    >
                                        {item.name}
                                    </li>
                                );
                            })
                        }
                        {
                            savedItems.length === 0 &&
                                <div>No boundaries saved...</div>
                        }
                    </ul>
                    <hr/>
                    <TextField
                        value={saveName}
                        className={classes.textField}
                        onChange={event => this.setState({ saveName: event.target.value })}
                        label="Save As..."
                    />
                </div>
                <div className={classes.buttonContainer}>
                    <Button
                        variant="contained"
                        color="default"
                        className={`${classes.button}`}
                        onClick={event => onComplete()}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button}`}
                        disabled={saveName === ""}
                        onClick={this.handleSave}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button}`}
                        disabled={selectedIndex === null}
                        onClick={this.handleLoad}
                    >
                        Load
                    </Button>
                </div>
            </Modal>
        );
    }
}

export default withStyles(styles)(SaveModal)