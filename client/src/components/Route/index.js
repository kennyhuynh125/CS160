/* global google */
import React from 'react';
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  TrafficLayer,
} = require("react-google-maps");

const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDkOgKW9d-YxAC_8kar8EZ-aL90qazdSNc&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs, withGoogleMap,
    lifecycle({
        componentDidMount() {
            const DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({
        origin: new google.maps.LatLng(37.3352, -121.8811),
        destination: new google.maps.LatLng(37.7749, -122.4194),
        travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
                directions: result
            });
        } else {
            console.error(`error fetching directions ${result}`);
        }
    });
    }
    })
)(props =>
    <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
    >
    <TrafficLayer autoUpdate />
    {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
);


export default class Map extends React.PureComponent {
    render() {
        return (
        <div>
            <MapWithADirectionsRenderer />
        </div>
        )
    }
}