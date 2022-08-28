import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '../Common/Modal';
import Button from '@material-ui/core/Button';
import DropDownTextField from '../Common/TextField/DropDownTextField';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    modalContent: {
        textAlign: 'center'
    },
    boundaryContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    modal: {
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
    }
});

class SetBoundariesModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            direction1: "",
            degrees: "",
            minutes: "",
            seconds: "",
            direction2: "",
            length: ""
        }
    }

    handleChange = name => event => this.setState({ [name] : event.target.value });

    addWayPoint = () => {

        const { direction1, degrees, minutes, seconds, direction2, length } = this.state;

        let bearing = direction1 === "N" ? 0 : 180;
        let totalDegrees = parseInt(degrees) + parseInt(minutes) / 60 + parseInt(seconds) / 3600;

        let direction = `${direction1}${direction2}`;
        if (direction !== "NE") totalDegrees = -totalDegrees;

        bearing = bearing + totalDegrees;
        if (direction === "SW") bearing = -bearing;

        this.props.addMarker(length, bearing);

        this.setState({
            direction1: "",
            degrees: "",
            minutes: "",
            seconds: "",
            direction2: "",
            length: ""
        });
    }


    render() {

        const { classes, open, dropStartPin, numberOfMarkers, autoComplete } = this.props;
        const { direction1, degrees, minutes, seconds, direction2, length } = this.state;

        return (
            <Modal open={open} classes={{root: classes.modal}}>
                <div className={classes.modalContent}>
                    {
                        numberOfMarkers === 0 &&
                        <div>
                            Tap map to drop pin.
                            <br />
                            <strong>OR</strong>
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                className={`${classes.button}`}
                                onClick={ dropStartPin } //dropStartPin
                            >
                                Use Current Location
                            </Button>
                        </div>
                    }
                    {
                        numberOfMarkers > 0 &&
                        <div>
                            <div>
                                Enter the boundary bearing and length or manually drop a pin by clicking the map.
                            </div>
                            <div className={classes.boundaryContainer}>
                                <DropDownTextField
                                    name="Direction"
                                    id="direction1"
                                    options={["N", "S"]}
                                    value={direction1}
                                    handleChange={this.handleChange('direction1')}
                                />
                                <TextField
                                    id="degrees"
                                    label="Degrees"
                                    value={degrees}
                                    onChange={this.handleChange('degrees')}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin='normal'
                                />
                                <TextField
                                    id="minutes"
                                    label="Minutes"
                                    value={minutes}
                                    onChange={this.handleChange('minutes')}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin='normal'
                                />
                                <TextField
                                    id="seconds"
                                    label="Seconds"
                                    value={seconds}
                                    onChange={this.handleChange('seconds')}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin='normal'
                                />
                                <DropDownTextField
                                    name="Direction"
                                    id="direction2"
                                    options={["E", "W"]}
                                    value={direction2}
                                    handleChange={this.handleChange('direction2')}
                                />
                            </div>
                            <div className={classes.boundaryContainer}>
                                <TextField
                                    id="length"
                                    label="Length"
                                    value={length}
                                    onChange={this.handleChange('length')}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    margin='normal'
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={`${classes.button}`}
                                    onClick={this.addWayPoint}
                                    disabled={!direction1 || !degrees || !minutes || !seconds || !direction2 || !length}
                                >
                                    Add Boundary
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={`${classes.button}`}
                                    onClick={autoComplete}
                                    disabled={numberOfMarkers < 2}
                                >
                                    Auto Complete Boundary
                                </Button>
                            </div>
                        </div>
                    }
                </div>
            </Modal>
        );
    }
}

export default withStyles(styles)(SetBoundariesModal)