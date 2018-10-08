import React, { Component } from 'react';
import { Button } from 'reactstrap';
import axios from 'axios';

/*
This component is the main page when the user goes on our site.
*/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            latitude: 0,
            longitude: 0,
            location: [],
        }
    }

    // before we render the home page, make an api call to get all users
    // and set the response to the users state.
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

    render() {
        // print state to see if are retrieving users for testing purposes
        console.log(this.state);
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        return (
            <div>
                Hello World!
                {
                    isLoggedIn && (
                        <p>You are logged in!</p>
                    )
                }
                <p>Customer? {sessionStorage.getItem('customer')}</p>
                <p>Driver? {sessionStorage.getItem('driver')}</p>
                <p>User Id? {sessionStorage.getItem('userId')}</p>
                <Button onClick={this.getGeoLocation}>Click</Button>
                {
                    this.state.latitude !== 0 && this.state.longitude !== 0 && (
                        <div>
                            <p>Latitude: {this.state.latitude}</p>
                            <p>Longitude: {this.state.longitude}</p>
                            <Button onClick={this.getLocation}>Get Location</Button>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default Home;
