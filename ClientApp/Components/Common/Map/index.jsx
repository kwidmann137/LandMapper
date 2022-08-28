import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

class MapContainer extends Component {

    static defaultProps = {
        center: {
            lat: 29.56,
            lng: -98.88
        },
        zoom: 11
    };

    render() {

        const { google, children, initialCenter, onClick = () => {} } = this.props;

        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <Map
                    google={google}
                    initialCenter={initialCenter}
                    zoom={14}
                    onClick={onClick}
                >
                    {children}
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBY0Hs6IGl9zzKXJyfhEuRDixhsiIsL3kk'
})(MapContainer);