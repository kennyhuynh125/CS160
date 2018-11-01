import React from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';
import StandaloneSearchBox from '../Reusable/Searchbox'
import MapWithADirectionsRenderer from '../Reusable/DirectionsRenderer'

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
            loading: true,
        }
    }

    componentDidMount() {
        this.getGeoLocation()
        this.setState({
            loading: false
        })
    }

    getDriver = () => {
        let timeout = 0;
        if (this.state.latitude === 0) {
            timeout = 3000;
        }
        setTimeout(function() {axios.post(`/api/getdriver`, {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
        })
        .then((response) => {
            console.log(response);
            this.setState({
                    destLatitude: response.data[0].driverLatitude,
                    destLongitude: response.data[0].driverLongitude,
            })
        })}.bind(this),timeout)
        console.log(timeout)
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
        console.log(this.state);
        return (
        <div>
            <StandaloneSearchBox onPlacesChanged={this.updateDestination}/>
            <Button onClick={this.getDriver}>Find Driver</Button>
                {
                    this.state.loading !== true && this.state.latitude !== 0 && this.state.longitude !== 0 && 
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
