import React from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import StandaloneSearchBox from './searchbox'
import MapWithADirectionsRenderer from './directionsrenderer'

export default class Map extends React.PureComponent {
    constructor(props) {
        super();
        this.state = {
            latitude: 0,
            longitude: 0,
            location: [],
            destLatitude: 0,
            destLongitude: 0,
            destLocation: [],
        }
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/');
            const users = await res.json();
            this.setState({
                users: users,
            });
        } catch (e) {
            console.log(e);
        }
    }

    getGeoLocation = () => {
        const geolocation = navigator.geolocation;
        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            });
        } else {
            console.log('Not supported');
        }
    }

    getLocation = () => {
        const latitude = this.state.latitude;
        const longitude = this.state.longitude;
        axios.get(`/api/location/${latitude}/${longitude}`)
        .then((response) => {
            this.setState({ location: response.data });
        })
        .catch((error) => {
            console.log(error);
        })
    }

    updateDestination = (lat, long) => {
        this.setState({destLatitude: lat, destLongitude: long})
    }


    render() {
        return (
        <div>
            <StandaloneSearchBox onPlacesChanged={this.updateDestination(37.7749, -122.4194)}/>
            <Button onClick={this.getGeoLocation}>Find Route</Button>
                {
                    this.state.latitude !== 0 && this.state.longitude !== 0 && 
                    this.state.destLongitude !== 0 && this.state.destLongitude !== 0 && (
                        <div>
                            <p>Latitude: {this.state.latitude}</p>
                            <p>Longitude: {this.state.longitude}</p>
                            <MapWithADirectionsRenderer 
                                latitude={this.state.latitude} 
                                longitude={this.state.longitude} 
                                destLatitude={this.state.destLatitude} 
                                destLongitude={this.state.destLongitude} 
                            />
                        </div>
                    )
                }
        </div>
        )
    }
}