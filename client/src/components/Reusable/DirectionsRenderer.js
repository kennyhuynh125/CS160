/* global google */
import React from 'react';
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  TrafficLayer,
  Marker,
} from "react-google-maps";

const MapWithADirectionsRenderer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDkOgKW9d-YxAC_8kar8EZ-aL90qazdSNc&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `400px` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withScriptjs, withGoogleMap,
    lifecycle({
        componentWillMount() {
            this.setState({
                onDirectionChange: () => {
                    const DirectionsService = new google.maps.DirectionsService();
                    DirectionsService.route({
                        origin: new google.maps.LatLng(this.props.latitude, this.props.longitude),
                        destination: new google.maps.LatLng(this.props.destLatitude, this.props.destLongitude),
                        travelMode: google.maps.TravelMode.DRIVING,
                    }, (result, status) => {
                        if (result !== null && result.routes.length !== 0) {
                            this.props.setPath(result.routes[0].overview_path);
                        }
                        if (result !== null) {
                            if (status === google.maps.DirectionsStatus.OK) {
                                this.setState({
                                    directions: result
                                });
                            } else {
                                console.error(`error fetching directions ${result}`);
                            }
                        }
                    });
                },
                onPointChange: () => {
                    this.setState({
                        driverLat: this.props.driveLat,
                        driverLng: this.props.driveLng,
                    });
                }
            });
        },
    }),
)(props =>
    <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(37.3352, -121.8811)}
    >
    <TrafficLayer autoUpdate />
    {props.onDirectionChange()}
    {props.onPointChange}
    <Marker
        position={{ lat: props.driverLat, lng: props.driverLng }}
    />
    {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
);

export default MapWithADirectionsRenderer;
