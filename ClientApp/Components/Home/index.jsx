import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Map from '../Common/Map';
import Marker from '../Common/Marker';
import Polyline from '../Common/Polyline';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Icon from '@material-ui/core/Icon';
import BoundariesModal from './SetBoundariesModal';
import LocationModal from './GetLocationModal';
import { geolocated } from 'react-geolocated';
import * as Turf from '@turf/turf';
import LocationIcon from '../../Resources/Images/location_icon.png';
import Save from '@material-ui/icons/Save';
import SaveModal from './SaveModal';

const styles = theme => ({
    container: {
        position: 'relative'
    },
    button: {
        margin: theme.spacing.unit
    },
    startButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translate(-50%)'
    },
    topButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 35
    },
    secondaryToolbarContainer: {
        position: 'absolute',
        display: 'flex',
        top:40,
        left: 10
    },
    locationControl: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& > label': {
            fontSize: 12,
            marginTop: 10,
            marginBottom: -16,
            whiteSpace: 'nowrap'
        }
    }
});

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            startLat: null,
            startLong: null,
            markers: [],
            dialogOpen: false,
            locationModalOpen: false,
            showLocation: false,
            currentLocation: null,
            showSaveModal: false
        };
    }

    handleChange = name => event => this.setState({ [name] : event.target.value });

    toggleLocation = () => {
        if (this.checkGeoLocation()) {
            console.log("Location enabled");
            this.setState({ showLocation: !this.state.showLocation });
        }
    }

    dropStartPin = () => {

        const { coords } = this.props;

        if (this.checkGeoLocation() && coords) {
            let markers = [];
            markers.push({ lat: coords.latitude, long: coords.longitude });
            this.setState({ startLat: coords.latitude, startLong: coords.longitude, markers });
        }
    }

    checkGeoLocation = () => {
        const { isGeolocationAvailable, isGeolocationEnabled } = this.props;

        let allowed = true;

        if (!isGeolocationAvailable) {
            this.setState({
                locationModalOpen: true,
                locationModalMessage: "Geolocation is not supported by your device or browser."
            });
            allowed = false;
        }

        if (!isGeolocationEnabled) {
            this.setState({
                locationModalOpen: true,
                locationModalMessage: "Geolocation is not enabled.  Please enable geolocation for this site in your browsers settings if you wish to use location features with this app."
            });
            allowed = false;
        }

        return allowed;
    }

    handleMapClick = (mapProps, map, clickEvent) => {

        const { markers, dialogOpen } = this.state;

        if (markers.length === 0 && dialogOpen) {
            let markers = [];
            let lat = clickEvent.latLng.lat();
            let long = clickEvent.latLng.lng();
            lat = parseFloat(lat);
            long = parseFloat(long);
            markers.push({ lat: lat, long: long });
            this.setState({ startLat: lat, startLong: long, markers });
        }else if (markers.length > 0 && !this.boundaryComplete()) {
            let newMarkers = [...markers];
            let lat = clickEvent.latLng.lat();
            let long = clickEvent.latLng.lng();
            lat = parseFloat(lat);
            long = parseFloat(long);
            newMarkers.push({ lat: lat, long: long });
            this.setState({ markers: newMarkers });
        }
    }

    boundaryComplete = () => {
        const { markers } = this.state;

        return markers.length > 2
            && markers[0].lat === markers[markers.length - 1].lat
            && markers[0].long === markers[markers.length - 1].long;
    }

    addMarker = (distance, bearing) => {

        let markers = [...this.state.markers];
        let lastPoint = markers[markers.length - 1];

        let startCoordinates = [lastPoint.long, lastPoint.lat];
        let startPoint = Turf.point(startCoordinates);
        distance = distance / 3280.84; // Convert feet to km;

        let destination = Turf.destination(startPoint, distance, bearing);
        const { coordinates } = destination.geometry;

        // Go from lon/lat to lat/lon
        markers.push({ lat: coordinates[1], long: coordinates[0] });
        this.setState({ markers });

        if (this.boundaryCompelte()) {
            this.setState({ dialogOpen: false });
        }
    }

    removeLastMarker = () => {
        const { markers } = this.state;
        let newMarkers = [...markers];
        newMarkers.splice(-1, 1);

        this.setState({ markers: newMarkers, dialogOpen: true });
    }

    autoComplete = () => {
        let newMarkers = [...this.state.markers];
        newMarkers.push(this.state.markers[0]);

        this.setState({ markers: newMarkers, dialogOpen: false });
    }

    handleSaveComplete = markers => {

        console.log("on complete");
        console.log(markers)

        if (markers) {
            this.setState({ showSaveModal: !this.state.showSaveModal, markers });
        } else {
            this.setState({ showSaveModal: !this.state.showSaveModal });
        }

    }

    render() {

        const { classes, coords } = this.props;
        const { markers, dialogOpen, locationModalOpen, locationModalMessage, showLocation, showSaveModal } = this.state;

        return (
            <div className={classes.container}>
                <Map
                    initialCenter={{
                        lat: coords ? coords.latitude : 29.56,
                        lng: coords ? coords.longitude : -98.88
                    }}
                    onClick={this.handleMapClick}
                >
                    {
                        showLocation &&
                        <Marker
                            name="currentLocation"
                            id="currentLocation"
                            position={{ lat: coords.latitude, lng: coords.longitude }}
                            icon={{
                                url: LocationIcon,
                                scaledSize: new google.maps.Size(32, 32)
                            }}
                        />
                    }
                    {
                        markers.map((marker, index) => <Marker key={index} name={index} position={{ lat: marker.lat, lng: marker.long}} />)
                    }
                    {
                        markers.length > 0 &&
                        <Polyline
                            path={markers.map(marker => ({ lat: marker.lat, lng: marker.long }))}
                            strokeColor="#0000FF"
                            stokeOpacity={0.8}
                            strokeWeight={2}
                        />
                    }
                </Map>
                <div className={classes.topButtonContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button}`}
                        disabled={markers.length < 2}
                        onClick={this.removeLastMarker}
                    >
                        Remove Last Point
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button}`}
                        disabled={markers.length === 0}
                        onClick={() => this.setState({ dialogOpen: false, markers: [] })}
                    >
                        Reset
                    </Button>
                </div>
                <div className={classes.secondaryToolbarContainer}>
                    <div className={classes.locationControl}>
                        <label>Show Location:</label>
                        <Switch
                            checked={showLocation}
                            onChange={this.toggleLocation}
                            value="showLocation"
                            color="primary"
                        />
                    </div>
                    <IconButton
                        className={`${classes.button}`}
                        onClick={() => this.setState({ showSaveModal: !this.state.showSaveModal })}
                        variant="contained"
                        color="primary"
                    >
                        <Icon
                            component={Save}
                        />
                    </IconButton>
                </div>
                {
                    markers.length === 0 &&
                    <Button
                        variant="contained"
                        color="primary"
                        className={`${classes.button} ${classes.startButton}`}
                        onClick={() => this.setState({ dialogOpen: true })}
                        disabled={markers.length > 0}
                    >
                        Start
                    </Button>
                }
                <BoundariesModal
                    open={dialogOpen}
                    numberOfMarkers={markers.length}
                    dropStartPin={this.dropStartPin}
                    addMarker={this.addMarker}
                    autoComplete={this.autoComplete}
                />
                <LocationModal
                    open={locationModalOpen}
                    message={locationModalMessage}
                    onClick={() => this.setState({ locationModalMessage: "", locationModalOpen: false })}
                />
                <SaveModal
                    markers={markers}
                    onComplete={this.handleSaveComplete}
                    open={showSaveModal}
                />
            </div>
        );
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true
    },
    watchPosition: true
})(withStyles(styles)(Home));